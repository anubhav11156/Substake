// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {IwstETH} from "./interfaces/IwstETH.sol";
import {ISubstakeL1Manager} from "./interfaces/ISubstakeL1Manager.sol";
import {ISubstakeL1Config} from "./interfaces/ISubstakeL1Config.sol";
import {IwETH} from "./interfaces/IwETH.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {SubstakeLib} from "../libs/SubstakeLib.sol";
import {ISubstakeVault} from "../L2/interfaces/ISubstakeVault.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@scroll-tech/contracts/L1/gateways/IL1ETHGateway.sol";
import "@scroll-tech/contracts/L1/IL1ScrollMessenger.sol";
import "@scroll-tech/contracts/L1/rollup/IL1MessageQueue.sol";

uint256 constant DECIMALS = 1000000000000000000;
uint256 constant STAKE = 0;
uint256 constant UNSTAKE = 1;
uint256 constant VALUE = 0;

contract SubstakeL1Manager is ISubstakeL1Manager, AccessControlUpgradeable {
    ISubstakeL1Config substakeL1Config;

    mapping(uint256 => bool) stakeBatchStatus;
    mapping(uint256 => bool) unstakeBatchStatus;

    function initialize(address _admin, address _substakeL1Config) external initializer {
        SubstakeLib.zeroAddressCheck(_admin);
        SubstakeLib.zeroAddressCheck(_substakeL1Config);
        substakeL1Config = ISubstakeL1Config(_substakeL1Config);
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    //@note_anubhav : Below get executed on mainnet fork
    function stakeToLido(uint256 ethAmount, uint256 stakeBatchId)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (uint256)
    {
        if (stakeBatchStatus[stakeBatchId]) {
            revert BatchAlreadyUsed();
        }
        if (ethAmount > ethBalance()) {
            revert InsufficientContractBalance();
        }
        uint256 shares = _stakeToLido(ethAmount);
        stakeBatchStatus[stakeBatchId] = true;
        emit Staked(ethAmount, shares, stakeBatchId);
        return shares;
    }

    function unstakeWstETH(uint256 wstETHAmount, uint256 unstakeBatchId)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
        returns (uint256)
    {
        if (unstakeBatchStatus[unstakeBatchId]) {
            revert BatchAlreadyUsed();
        }
        if (wstETHAmount > wstEthBalance()) {
            revert InsufficientWstETH();
        }
        uint256 wETH = _swapExactInputSingle(wstETHAmount);
        _unWrapETH(uint256(wETH));
        unstakeBatchStatus[unstakeBatchId] = true;
        emit Unstaked(wETH, wstETHAmount, unstakeBatchId);
        return wETH;
    }

    function sendStakeMessage(
        uint256 _batchId,
        uint256 _totalShares,
        uint256 _exRate,
        uint256 _gaslimitMultiplier,
        uint256 _l2Gaslimit,
        uint256 _fee
    ) external payable onlyRole(DEFAULT_ADMIN_ROLE) {
        address _from = address(this);
        bytes memory _data = abi.encodeCall(ISubstakeVault.stakeHandler, (_from, _batchId, _totalShares, _exRate));
        uint256 gasLimitCalculated =
            IL1MessageQueue(substakeL1Config.getScrollL1MessageQueue()).calculateIntrinsicGasFee(_data);
        uint256 _gaslimit = (gasLimitCalculated * _gaslimitMultiplier)+_l2Gaslimit;
        IL1ScrollMessenger(substakeL1Config.getScrollL1Messenger()).sendMessage{value: _fee}(
            substakeL1Config.getSubstakeVault(), VALUE, _data, _gaslimit
        );
        emit MessageSentToL2(substakeL1Config.getSubstakeVault(), STAKE, _data);
    }

    function sendUnstakeMessage(
        uint256 _batchId,
        uint256 _ethAmount,
        uint256 _totalShares,
        uint256 _exRate,
        uint256 _gaslimitMultiplier,
        uint256 _l2Gaslimit,
        uint256 _fee
    ) external payable onlyRole(DEFAULT_ADMIN_ROLE) {
        address _from = address(this);
        bytes memory _data =
            abi.encodeCall(ISubstakeVault.withdrawHandler, (_from, _batchId, _ethAmount, _totalShares, _exRate));
        bytes memory _message = abi.encode(_from, substakeL1Config.getSubstakeVault(), _ethAmount, _data);

        uint256 gasLimitCalculted =
            IL1MessageQueue(substakeL1Config.getScrollL1MessageQueue()).calculateIntrinsicGasFee(_message);
        uint256 _gasLimit = (gasLimitCalculted * _gaslimitMultiplier) + _l2Gaslimit;

        IL1ETHGateway(substakeL1Config.getScrollL1ETHGateway()).depositETHAndCall{value: _ethAmount + _fee}(
            substakeL1Config.getSubstakeVault(), _ethAmount, _message, _gasLimit
        );
        emit MessageSentToL2(substakeL1Config.getSubstakeVault(), UNSTAKE, _message);
    }

    function _swapExactInputSingle(uint256 amountIn) internal returns (uint256) {
        IwstETH(substakeL1Config.getLidoWstETHToken()).approve(
            address(substakeL1Config.getUniswapSwapRouter()), amountIn
        );
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: substakeL1Config.getLidoWstETHToken(),
            tokenOut: substakeL1Config.getWeth(),
            fee: uint24(substakeL1Config.getUniswapPoolFee()),
            recipient: address(this),
            deadline: block.timestamp + substakeL1Config.getUniswapSwapDeadline(),
            amountIn: amountIn,
            amountOutMinimum: _uninSwapLimit(amountIn),
            sqrtPriceLimitX96: 0
        });
        uint256 amountOut = ISwapRouter(substakeL1Config.getUniswapSwapRouter()).exactInputSingle(params);
        return amountOut;
    }

    function _uninSwapLimit(uint256 sharesIn) internal view returns (uint256) {
        uint256 ethAmount = IwstETH(substakeL1Config.getLidoWstETHToken()).getStETHByWstETH(sharesIn);
        return (ethAmount - ((ethAmount * substakeL1Config.getSwapSlipage()) / 10000));
    }

    function _unWrapETH(uint256 wETHAmount) internal {
        return IwETH(substakeL1Config.getWeth()).withdraw(wETHAmount);
    }

    function _stakeToLido(uint256 amount) internal returns (uint256) {
        address wstETH = substakeL1Config.getLidoWstETHToken();
        (bool success,) = payable(wstETH).call{value: amount}("");
        require(success, "Lido stake tx failed");
        return (IwstETH(substakeL1Config.getLidoWstETHToken()).getWstETHByStETH(amount));
    }

    function getLidoExchangeRate() public view returns (uint256) {
        return (IwstETH(substakeL1Config.getLidoWstETHToken()).tokensPerStEth());
    }

    function wstEthBalance() public view returns (uint256) {
        return (IwstETH(substakeL1Config.getLidoWstETHToken()).balanceOf(address(this)));
    }

    function ethBalance() public view returns (uint256) {
        return address(this).balance;
    }

    fallback() external payable {}
    receive() external payable {}
}
