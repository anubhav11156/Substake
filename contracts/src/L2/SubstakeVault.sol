// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../libs/SubstakeLib.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ISubstakeVault} from "./interfaces/ISubstakeVault.sol";
import {ISubstakeL2Config} from "./interfaces/ISubstakeL2Config.sol";

uint8 constant STAKE = 0;
uint8 constant UNSTAKE = 1;

contract SubstakeVault is ISubstakeVault, ERC20Upgradeable, AccessControlUpgradeable {
    ISubstakeL2Config public substakeL2Config;

    uint256 stakeBatchId;
    uint256 unstakeBatchId;
    uint256 previousBatchStakeTime;
    uint256 previousBatchUnstakeTime;
    uint56 activeBatchSUBTokenBalance;
    address payable feesCollector;

    function initialize(address _admin, address _substakeL2Config) external initializer {
        SubstakeLib.zeroAddressCheck(_admin);
        SubstakeLib.zeroAddressCheck(_substakeL2Config);
        substakeL2Config = ISubstakeL2Config(_substakeL2Config);
        feesCollector = _admin;
        __ERC20_init("SubToken", "SUB");
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _createNewStakeBatch();
        _createNewUnstakeBatch();
    }

    mapping(uint256 => StakeBatch) batchIdToStakeBatch;
    mapping(uint256 => UnstakeBatch) batchIdToUnstakeBatch;
    mapping(uint256 => mapping(address => uint256)) unstakersSUBToken;
    mapping(uint256 => address[]) batchIdToStakers;
    mapping(uint256 => address[]) batchIdToUnstakers;

    struct StakeBatch {
        uint256 batchId;
        uint256 ethBalance;
        bool isClosed;
    }

    struct UnstakeBatch {
        uint256 batchId;
        uint256 ethReceived;
        uint256 SubBalance;
        bool isClosed;
    }

    function deposit(uint256 assets, address receiver) external override payable returns (uint256, uint256) {
        require(assets == msg.value, "Insufficient msg.value");
        require(assets <= maxDeposit(), "Invalid amount, more");
        uint256 fees = ISubstakeL2Config(substakeL2Config).computeFees(assets, 0);
        feesCollector.transfer(fees);
        uint256 _assets = assets - fees;
        uint256 shares = previewDeposit(_assets);
        uint256 batchId = _deposit(msg.sender, receiver, _assets, _shares);
        return (_assets, shares);
    }

    function mint(uint256 shares, address receiver) external returns (uint256, uint256) {}

    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256, uint256) {}

    function redeem(uint256 shares, address receiver, address owner) external returns (uint256, uint256) {}

    function asset() public returns (address) {
        return address(0);
    }

    function previewDeposit(uint256 assets) public returns (uint256) {
        return convertToShares(assets);
    }

    function previewMint() public returns (uint256) {}

    function previewWithdraw() public returns (uint256) {}

    function previewRedeem() public returns (uint256) {}

    function convertToAssets() public returns (uint256) {}

    function convertToShares() public returns (uint256) {}

    function maxDeposit() public returns (uint256) {}

    function maxMint() public returns (uint256) {}

    function maxWithdraw() public returns (uint256) {}

    function maxRedeem() public returns (uint256) {}

    function totalAsset() public returns (uint256) {}

    function vaultBalance() public returns(uint256){
        return address(this).balance;
    }

    function stakeThreshold() public returns(uint256){
        return (
            ISubstakeL2Config(substakeL2Config).getStakeThreshold()
        );
    }

    function unstakeThreshold() public returns(uint256){
         return (
            ISubstakeL2Config(substakeL2Config).getUntakeThreshold()
        );
    }

    function _deposit(address caller, address receiver, uint256 assets, uint256 shares) internal returns (uint256) {
        address(this).transfer(assets);
        _mint(receiver, shares);

        // @todo update the exrate here,
        // 1. total SubToken supply
        // 2. total asset

        uint256 currentStakeBatch = activeStakeBatch();
        batchIdToStakers[currentStakeBatch].push(receiver);
        if (_stakingCondition()) {
            _dispatchStakeBatch();
        }
        emit Deposit(caller, receiver, assets, shares);
        return currentStakeBatch;
    }

    function activeStakeBatch() public view returns (uint256) {
        return stakeBatchId;
    }

    function _dispatchStakeBatch() internal {}

    function _dispatchUnstakeBatch() internal {}

    function _stakingCondition() internal returns(bool){
        //@note_anubhav -> Add no. of stakers and time elapsed as well in staking condition
        return (
            (vaultBalance()>=stakeThreshold()) ? true : false
        );
    }

    function _unstakingCondition() internal returns(bool){
        return (
            (activeBatchSUBTokenBalance>=unstakeThreshold()) ? true : false
        );
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
        batchIdToUnstakeBatch[unstakeBatchId].batchId = stakeBatchId;
        batchIdToUnstakeBatch[unstakeBatchId].ethReceived = 0;
        batchIdToUnstakeBatch[unstakeBatchId].SubBalance = 0;
        batchIdToUnstakeBatch[unstakeBatchId].isClosed = false;
    }
}
