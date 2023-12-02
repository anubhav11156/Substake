// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import {IwstETH} from "./interfaces/IwstETH.sol";
import {IL1Manager} from "./interfaces/ISubstakeL1Manager.sol";
import {IL1Config} from "./interfaces/ISubstakeL1Config.sol";
import {IwETH} from "./interfaces/IwETH.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import {IMailbox} from "./interfaces/IMailbox.sol";
import {SubstakeLib} from "../libs/SubstakeLib.sol";
import {Test, console2} from "forge-std/Test.sol";

contract L1Manager is IL1Manager, Test {
    IL1Config public l1Config;

    uint256 public constant LIDO = 1;
    uint256 public constant UNISWAP = 1;
    uint256 public constant STAKE = 0;
    uint256 public constant UNSTAKE = 1;
    uint256 public constant DECIMALS = 1000000000000000000;
    uint32 constant scrollSepoliaDomain = 534351;
    uint32 constant ethereumSepoliaDomain = 11155111;

    constructor(address l1_config) {
        l1Config = IL1Config(l1_config);
    }

    // modifier onlyMailBox() {
    //     // require(msg.sender == l1Config.hyperlaneMailboxL1());
    //     _;
    // }

    mapping(uint256 => bool) public stakeBatchStatus;
    mapping(uint256 => bool) public unstakeBatchStatus;

    uint256[] currentStakeMessage = new uint256[](2);
    uint256[] currentUnstakeMessage = new uint256[](2);

    // function handle(uint32 _origin, bytes32 _sender, bytes calldata _message) external override onlyMailBox {
    //     uint256[] memory messageReceived = abi.decode(_message, (uint256[]));
    //     emit MessageReceived(SubstakeLib.bytes32ToAddress(_sender), address(this), messageReceived);

    //     if (messageReceived[0] == STAKE) {
    //         handle_stake(messageReceived);
    //     } else if (messageReceived[0] == UNSTAKE) {
    //         handle_unstake(messageReceived);
    //     }
    // }

    function stakeToLido(uint256 ethAmount, uint256 stakeBatchId) external returns (uint256) {
        if (ethAmount == 0) {
            revert("Amount cannot be zero");
        }
        if (stakeBatchStatus[stakeBatchId]) {
            revert("Stake batch already processed");
        }
        if (ethAmount > address(this).balance) {
            revert("Insufficient Contract ETH Balance");
        }
        // vm.deal(address(this), 10000000000000000000);
        uint256 shares = _stakeToLido(ethAmount);
        stakeBatchStatus[stakeBatchId] = true;
        emit Staked(ethAmount, shares, stakeBatchId, LIDO);
        return shares;
    }

    function unstakeWstETH(uint256 wstETHAmount, uint256 unstakeBatchId) external returns (uint256) {
        // swap wstETH for ETH on uinswap
        if (wstETHAmount == 0) {
            revert ZeroAmount();
        }
        if (unstakeBatchStatus[unstakeBatchId]) {
            revert BatchAlreadyUsed();
        }
        if (wstETHAmount > wstEthBalance()) {
            revert InsufficientWstETH();
        }
        uint256 wETH = _swapExactInputSingle(wstETHAmount);
        _unWrapETH(uint256(wETH));
        unstakeBatchStatus[unstakeBatchId] = true;
        emit Unstaked(wETH, wstETHAmount, unstakeBatchId, UNISWAP);
        return wETH;
    }

    function _swapExactInputSingle(uint256 amountIn) internal returns (uint256 amountOut) {
        IwstETH(l1Config.getLidoWstETHToken()).approve(address(l1Config.getUniswapSwapRouter()), amountIn);
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: l1Config.getLidoWstETHToken(),
            tokenOut: l1Config.getWeth(),
            // fee: uint24(l1Config.getUniswapPoolFee()),
            fee: 100,
            recipient: address(this),
            deadline: block.timestamp + l1Config.getUniswapSwapDeadline(),
            amountIn: amountIn,
            amountOutMinimum: 0, // better set it some value using uniswap price oracle
            sqrtPriceLimitX96: 0 // don't have it zero in production
        });
        amountOut = ISwapRouter(l1Config.getUniswapSwapRouter()).exactInputSingle(params);
    }

    function getLidoExchangeRate() public returns (uint256) {
        return (IwstETH(l1Config.getLidoWstETHToken()).tokensPerStEth());
    }

    function _unWrapETH(uint256 wETHAmount) internal {
        IwETH(l1Config.getWeth()).withdraw(wETHAmount);
    }

    function wstEthBalance() public returns (uint256) {
        return (l1Config.getL1ManagerWstETHBalance(address(this)));
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function _stakeToLido(uint256 amount) internal returns (uint256) {
        address wstETH = l1Config.getLidoWstETHToken();
        (bool success,) = payable(wstETH).call{value: amount}("");
        require(success, "Lido stake tx failed");
        return (IwstETH(l1Config.getLidoWstETHToken()).getWstETHByStETH(amount));
    }

    // function sendMessageToL2(uint256[] memory message) internal {
    //     address recipient = l1Config.getSubstakeVault();
    //     IMailbox(l1Config.hyperlaneMailboxL1()).dispatch{value: l1Config.getHyperlaneFee()}(
    //         scrollSepoliaDomain, SubstakeLib.addressToBytes32(recipient), abi.encode(message)
    //     );
    //     emit MessageSent(address(this), recipient, message);
    // }

    // function bridgeStaking() public {
    //     sendMessageToL2(currentStakeMessage);
    // }

    // function bridgeUnstaking() public {
    //     sendMessageToL2(currentUnstakeMessage);
    // }

    function handle_stake(uint256[] memory message) internal {
        currentStakeMessage[0] = message[1];
        currentStakeMessage[1] = message[2];
        currentStakeMessage[2] = (message[1] * 874277474257069909) / DECIMALS;
        // sendMessageToL2(message_payload);
    }

    function handle_unstake(uint256[] memory message) internal {
        currentUnstakeMessage[0] = message[1];
        currentUnstakeMessage[1] = message[2];
        // currentUnstakeMessage[3] =  // weth amount
        // sendMessageToL2(message_payload);
    }

    function stake_message(uint256 _shares, uint256 _exRate, uint256 _batchId)
        internal
        pure
        returns (uint256[] memory)
    {
        uint256[] memory payload = new uint256[](4);
        payload[0] = STAKE;
        payload[1] = _shares;
        payload[2] = _exRate;
        payload[3] = _batchId;
        return payload;
    }

    function unstake_message(uint256 ethAmount, uint256 _batchId) internal pure returns (uint256[] memory) {
        uint256[] memory payload = new uint256[](3);
        payload[0] = UNSTAKE;
        payload[1] = ethAmount;
        payload[2] = _batchId;
        return payload;
    }

    function updateConfig(address _newAddress) external {
        IL1Config(_newAddress);
    }

    function getL1Config() public view returns (address) {
        return address(l1Config);
    }

    fallback() external payable {}
    receive() external payable {}
}
