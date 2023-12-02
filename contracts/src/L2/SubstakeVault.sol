// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../libs/SubstakeLib.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
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
    uint56 activeBatchSUBTokenBalance;

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

    //@note todo later
    // function mint(uint256 shares, address receiver) external returns (uint256, uint256) {}
    // function withdraw(uint256 assets, address receiver, address owner) external returns (uint256, uint256) {}

    // @note approve shares to substakeVault from frontend
    function redeem(uint256 shares, address receiver, address owner)
        external
        whenNotPaused
        nonReentrant
        returns (uint256, uint256)
    {}

    function asset() public pure returns (address) {
        return address(0);
    }

    function previewDeposit(uint256 assets) public view returns (uint256) {
        return convertToShares(assets);
    }

    function previewMint(uint256 shares) public view returns (uint256) {}

    function previewWithdraw(uint256 assets) public view returns (uint256) {}

    function previewRedeem(uint256 shares) public view returns (uint256) {}

    function convertToAssets(uint256 shares) public view returns (uint256) {
        uint256 supply = ISubstakeL2Config(substakeL2Config).getExchangeRate().totalSubToken;
        return ((supply == 0) ? shares : shares.mulDiv(totalAssets(), supply, Math.Rounding.Floor));
    }

    function convertToShares(uint256 assets) public view returns (uint256) {
        uint256 supply = ISubstakeL2Config(substakeL2Config).getExchangeRate().totalSubToken;
        return ((assets == 0 || supply == 0) ? assets : assets.mulDiv(supply, totalAssets(), Math.Rounding.Floor));
    }

    function maxDeposit(address receiver) public view returns (uint256) {}

    function maxMint(address receiver) public view returns (uint256) {}

    function maxWithdraw(address owner) public view returns (uint256) {}

    function maxRedeem(address owner) public view returns (uint256) {}

    function totalAssets() public view returns (uint256) {
        return (vaultBalance() + _ethDueToDueToBacking() + ethInTransit());
    }

    function _ethDueToDueToBacking() internal view returns (uint256) {}

    function ethInTransit() public view returns (uint256) {
        return (ISubstakeL2Config(substakeL2Config).getExchangeRate().ethInTransit);
    }

    function getVaultBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function vaultBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function stakeThreshold() public view returns (uint256) {
        return (ISubstakeL2Config(substakeL2Config).getStakeThreshold());
    }

    function unstakeThreshold() public view returns (uint256) {
        return (ISubstakeL2Config(substakeL2Config).getUnstakeThreshold());
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

    function activeStakeBatch() public view returns (uint256) {
        return stakeBatchId;
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

    function _dispatchUnstakeBatch() internal {}

    function _stakingCondition() internal view returns (bool) {
        //@note_anubhav -> Add no. of stakers and time elapsed as well in staking condition
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
        batchIdToUnstakeBatch[unstakeBatchId].batchId = stakeBatchId;
        batchIdToUnstakeBatch[unstakeBatchId].ethReceived = 0;
        batchIdToUnstakeBatch[unstakeBatchId].SubBalance = 0;
        batchIdToUnstakeBatch[unstakeBatchId].isClosed = false;
    }

    fallback() external payable {}
    receive() external payable {}
}
