// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../libs/SubstakeLib.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import {ISubstakeL2Router} from "./interfaces/ISubstakeL2Router.sol";
import {ISubstakeVault} from "./interfaces/ISubstakeVault.sol";
import {ISubstakeL2Config} from "./interfaces/ISubstakeL2Config.sol";

uint8 constant STAKE = 0;
uint8 constant UNSTAKE = 1;
uint256 constant DECIMALS = 10 ** 18;

contract SubstakeVault is
    ISubstakeVault,
    ERC20Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable
{
    ISubstakeL2Config public substakeL2Config;

    using Math for uint256;

    uint256 stakeBatchId;
    uint256 unstakeBatchId;
    uint256 previousBatchStakeTime;
    uint256 previousBatchUnstakeTime;
    uint256 activeBatchSUBTokenBalance;

    function initialize(address _admin, address _substakeL2Config) external initializer {
        SubstakeLib.zeroAddressCheck(_admin);
        SubstakeLib.zeroAddressCheck(_substakeL2Config);
        substakeL2Config = ISubstakeL2Config(_substakeL2Config);
        __ERC20_init("SubToken", "SUB");
        __AccessControl_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _createNewStakeBatch();
        _createNewUnstakeBatch();
    }

    struct StakeBatch {
        uint256 batchId;
        uint256 ethBalance;
        bool isClosed;
    }

    struct UnstakeBatch {
        uint256 batchId;
        uint256 ethExpected;
        uint256 ethReceived;
        uint256 SubBalance;
        bool isClosed;
    }

    mapping(uint256 => StakeBatch) batchIdToStakeBatch;
    mapping(uint256 => UnstakeBatch) batchIdToUnstakeBatch;
    mapping(uint256 => mapping(address => uint256)) unstakersSUBTokenBalance;
    mapping(uint256 => address[]) batchIdToStakers;
    mapping(uint256 => address[]) batchIdToUnstakers;

    // @note transfer assets as msg.value from frontend
    function deposit(uint256 assets, address receiver)
        external
        override
        whenNotPaused
        nonReentrant
        returns (uint256, uint256)
    {
        require(assets <= maxDeposit(receiver), "Invalid amount, more");
        uint256 fees = ISubstakeL2Config(substakeL2Config).computeFees(assets, 0);
        ISubstakeL2Config(substakeL2Config).getFeeCollector().transfer(fees);
        uint256 _assets = assets - fees;
        uint256 shares = previewDeposit(_assets);
        uint256 batchId = _deposit(msg.sender, receiver, _assets, shares);
        return (shares, batchId);
    }

    // @note approve shares to substakeVault from frontend
    function redeem(uint256 shares, address receiver, address owner)
        external
        whenNotPaused
        nonReentrant
        returns (uint256, uint256)
    {
        require(shares <= maxRedeem(owner), "Invalid, greater than balance");
        uint256 fees = ISubstakeL2Config(substakeL2Config).computeFees(shares, 1);
        _transfer(owner, ISubstakeL2Config(substakeL2Config).getFeeCollector(), fees);
        uint256 _shares = shares - fees;
        uint256 assets = previewRedeem(_shares);
        activeBatchSUBTokenBalance += _shares;
        uint256 batchId = _withdraw(msg.sender, receiver, owner, assets, shares);
        unstakersSUBTokenBalance[batchId][receiver] = _shares;
        return (assets, batchId);
    }

    function asset() public pure returns (address) {
        return address(0);
    }

    function previewDeposit(uint256 assets) public view returns (uint256) {
        return convertToShares(assets);
    }

    function previewMint(uint256 shares) public view returns (uint256) {
        return convertToAssets(shares);
    }

    function previewWithdraw(uint256 assets) public view returns (uint256) {
        return convertToShares(assets);
    }

    function previewRedeem(uint256 shares) public view returns (uint256) {
        return convertToAssets(shares);
    }

    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 supply = exchangeRate().totalSubToken;
        return ((supply == 0) ? shares : shares.mulDiv(totalAssets(), supply, Math.Rounding.Floor));
    }

    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 supply = exchangeRate().totalSubToken;
        return ((assets == 0 || supply == 0) ? assets : assets.mulDiv(supply, totalAssets(), Math.Rounding.Floor));
    }

    function maxDeposit(address receiver) public pure returns (uint256) {
        return type(uint256).max;
    }

    function maxMint(address receiver) public pure returns (uint256) {
        return type(uint256).max;
    }

    function maxWithdraw(address owner) public view returns (uint256) {
        return (convertToAssets(balanceOf(owner)));
    }

    function maxRedeem(address owner) public view returns (uint256) {
        return balanceOf(owner);
    }

    function totalAssets() public view returns (uint256) {
        return (vaultBalance() + ethDueToBackingToken() + ethInTransit());
    }

    function ethInTransit() public view returns (uint256) {
        return exchangeRate().ethInTransit;
    }

    function vaultBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function ethDueToBackingToken() public view returns (uint256) {
        uint256 _totalwstETH = exchangeRate().totalwstETH;
        uint256 _lidoExRate = exchangeRate().lidoExRate;
        uint256 _ethPerWstETH = (DECIMALS * DECIMALS) / _lidoExRate;
        return ((_totalwstETH * _ethPerWstETH) / DECIMALS);
    }

    function stakeThreshold() public view returns (uint256) {
        return (ISubstakeL2Config(substakeL2Config).getStakeThreshold());
    }

    function unstakeThreshold() public view returns (uint256) {
        return (ISubstakeL2Config(substakeL2Config).getUnstakeThreshold());
    }

    function activeStakeBatch() public view returns (uint256) {
        return stakeBatchId;
    }

    function activeUnstakeBatch() public view returns (uint256) {
        return unstakeBatchId;
    }

    function getPreviousBatchStakeTime() public view returns (uint256) {
        return previousBatchStakeTime;
    }

    function getPreviousBatchUnstakeTime() public view returns (uint256) {
        return previousBatchUnstakeTime;
    }

    function getAciveUnstakeBatchUnstakersLength() public view returns (uint256) {
        return batchIdToUnstakers[activeUnstakeBatch()].length;
    }

    function getActiveStakeBatchStakersLenght() public view returns (uint256) {
        return batchIdToStakers[activeStakeBatch()].length;
    }

    function getStakeBatchDetail(uint256 batchId) public view returns (StakeBatch memory) {
        require(batchId <= activeStakeBatch(), "Invalid StakeBatchId");
        return batchIdToStakeBatch[batchId];
    }

    function getUnstakeBatchDetail(uint256 batchId) public view returns (UnstakeBatch memory) {
        require(batchId <= activeUnstakeBatch(), "Invalid UnstakeBatchId");
        return batchIdToUnstakeBatch[batchId];
    }

    function ethPerSubToken() public view returns (uint256) {
        uint256 supply = exchangeRate().totalSubToken;
        return (
            (supply == 0 || totalAssets() == 0) ? DECIMALS : DECIMALS.mulDiv(totalAssets(), supply, Math.Rounding.Floor)
        );
    }

    function subTokenPerEth() public view returns (uint256) {
        uint256 supply = exchangeRate().totalSubToken;
        return (
            (supply == 0 || totalAssets() == 0) ? DECIMALS : DECIMALS.mulDiv(supply, totalAssets(), Math.Rounding.Floor)
        );
    }

    function exchangeRate() public view returns (ISubstakeL2Config.ExchangeRate memory) {
        return (ISubstakeL2Config(substakeL2Config).getExchangeRateData());
    }

    function dispatchStakeBatch() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _dispatchStakeBatch();
    }

    function dispatchUnstakeBatch() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _dispatchUnstakeBatch();
    }

    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal returns (uint256) {
        _mint(receiver, shares);
        ISubstakeL2Config(substakeL2Config).updateTotalETH(totalAssets());
        ISubstakeL2Config(substakeL2Config).updateTotalSubToken(totalSupply());
        uint256 currentStakeBatch = activeStakeBatch();
        batchIdToStakers[currentStakeBatch].push(receiver);
        if (_stakingCondition()) {
            _dispatchStakeBatch();
        }
        emit Deposit(caller, receiver, assets, shares);
        return currentStakeBatch;
    }

    function _withdraw(address caller, address receiver, address owner, uint256 assets, uint256 shares)
        internal
        returns (uint256)
    {
        if (caller != owner) {
            _spendAllowance(owner, caller, shares);
        }
        _transfer(owner, address(this), shares);
        uint256 currentUnstakeBatchId = activeUnstakeBatch();
        batchIdToUnstakers[currentUnstakeBatchId].push(receiver);
        if (_unstakingCondition()) {
            _dispatchUnstakeBatch();
        }
        emit Withdraw(caller, receiver, owner, assets, shares);
        return currentUnstakeBatchId;
    }

    function _dispatchStakeBatch() internal {
        uint256 currentStakeBatch = activeStakeBatch();
        uint256 amount;
        address recipient = ISubstakeL2Config(substakeL2Config).getSubstakeL1Manager();

        //@note_anubhav -> write messaging logic here
        previousBatchStakeTime = block.timestamp;
        batchIdToStakeBatch[currentStakeBatch].ethBalance = amount;
        batchIdToStakeBatch[currentStakeBatch].isClosed = true;
        _createNewStakeBatch();
        emit BatchSentToL1(currentStakeBatch, STAKE, amount, recipient);
    }

    function _dispatchUnstakeBatch() internal {
        uint256 currentUnstakeBatch = activeUnstakeBatch();
        uint256 _assets = convertToAssets(activeBatchSUBTokenBalance);
        address recipient = ISubstakeL2Config(substakeL2Config).getSubstakeL1Manager();

        // @note_anubhav -> write messaging logic here
        previousBatchUnstakeTime = block.timestamp;
        batchIdToUnstakeBatch[currentUnstakeBatch].isClosed = true;
        batchIdToUnstakeBatch[currentUnstakeBatch].ethExpected = _assets;
        batchIdToUnstakeBatch[currentUnstakeBatch].SubBalance = activeBatchSUBTokenBalance;
        _createNewUnstakeBatch();
        emit BatchSentToL1(currentUnstakeBatch, UNSTAKE, _assets, recipient);
    }

    function _stakingCondition() internal view returns (bool) {
        return ((vaultBalance() >= stakeThreshold()) ? true : false);
    }

    function _unstakingCondition() internal view returns (bool) {
        return ((activeBatchSUBTokenBalance >= unstakeThreshold()) ? true : false);
    }

    function _createNewStakeBatch() internal {
        stakeBatchId++;
        batchIdToStakeBatch[stakeBatchId].batchId = stakeBatchId;
        batchIdToStakeBatch[stakeBatchId].ethBalance = 0;
        batchIdToStakeBatch[stakeBatchId].isClosed = false;
    }

    function _createNewUnstakeBatch() internal {
        unstakeBatchId++;
        activeBatchSUBTokenBalance = 0;
        batchIdToUnstakeBatch[unstakeBatchId].batchId = unstakeBatchId;
        batchIdToUnstakeBatch[unstakeBatchId].ethExpected = 0;
        batchIdToUnstakeBatch[unstakeBatchId].ethReceived = 0;
        batchIdToUnstakeBatch[unstakeBatchId].SubBalance = 0;
        batchIdToUnstakeBatch[unstakeBatchId].isClosed = false;
    }

    function _distributeETH(uint256 _id, uint256 _amount) internal {
        uint256 chunkSize = batchIdToUnstakers[_id].length;
        uint256 totalSubTokenInBatch = batchIdToUnstakeBatch[_id].SubBalance;
        for (uint256 i = 0; i < chunkSize; i++) {
            address _unstaker = batchIdToUnstakers[_id][i];
            uint256 _unstakerSubTokenShare = unstakersSUBTokenBalance[_id][_unstaker];
            uint256 _unstakerETHShare = unstakerETHShare(_unstakerSubTokenShare, _amount, totalSubTokenInBatch);
            payable(_unstaker).transfer(_unstakerETHShare);
        }
    }

    function unstakerETHShare(uint256 unstakerSubTokenShare, uint256 totalETHInBatch, uint256 totalSubTokenInBatch)
        internal
        pure
        returns (uint256)
    {
        return (unstakerSubTokenShare.mulDiv(totalETHInBatch, totalSubTokenInBatch, Math.Rounding.Floor));
    }

    function stakeHandler(address _from, uint256 _batchId, uint256 _totalShares, uint256 _exRate) external override {
        address substakeL1Manager = ISubstakeL2Config(substakeL2Config).getSubstakeL1Manager();
        require(_from == substakeL1Manager, "Not Authorised!");
        ISubstakeL2Config(substakeL2Config).updateEthInTransit(
            exchangeRate().ethInTransit - batchIdToStakeBatch[_batchId].ethBalance
        );
        ISubstakeL2Config(substakeL2Config).updateTotalWstETH(_totalShares);
        ISubstakeL2Config(substakeL2Config).updateLidoExRate(_exRate);
        emit BatchFromL1(_batchId, STAKE, _from);
    }

    function withdrawHandler(address _from, uint256 _batchId, uint256 _ethAmount, uint256 _totalShares, uint256 _exRate)
        external
        override
    {
        address substakeL1Manager = ISubstakeL2Config(substakeL2Config).getSubstakeL1Manager();
        require(_from == substakeL1Manager, "Not Authorised!");
        batchIdToUnstakeBatch[_batchId].ethReceived = _ethAmount;
        ISubstakeL2Config(substakeL2Config).updateTotalWstETH(_totalShares);
        ISubstakeL2Config(substakeL2Config).updateLidoExRate(_exRate);
        uint256 sharesToBurn = batchIdToUnstakeBatch[_batchId].SubBalance;
        _burn(address(this), sharesToBurn);
        _distributeETH(_batchId, _ethAmount);
        ISubstakeL2Config(substakeL2Config).updateTotalSubToken(totalSupply());
        ISubstakeL2Config(substakeL2Config).updateTotalETH(totalAssets());
        emit BatchFromL1(_batchId, UNSTAKE, substakeL1Manager);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    fallback() external payable {}
    receive() external payable {}
}
