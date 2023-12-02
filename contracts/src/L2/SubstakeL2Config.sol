// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../libs/SubstakeLib.sol";
import {ISubstakeL2Config} from "./interfaces/ISubstakeL2Config.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract SubstakeL2Config is ISubstakeL2Config, AccessControlUpgradeable {
    bytes32 private constant ADMIN = keccak256("ADMIN");
    bytes32 private constant SCROLL_L2_ETH_GATEWAY = keccak256("SCROLL_L2_ETH_GATEWAY");
    bytes32 private constant SUBSTAKE_VAULT = keccak256("SUBSTAKE_VAULT");
    bytes32 private constant SUBSTAKE_L1_MANAGER = keccak256("SUBSTAKE_L1_MANAGER");
    bytes32 private constant FEE_COLLECTOR = keccak256("FEE_COLLECTOR");
    bytes32 private constant STAKING_FEES_IN_BIPS = keccak256("STAKING_FEES_IN_BIPS");
    bytes32 private constant UNSTAKING_FEES_IN_BIPS = keccak256("UNSTAKING_FEES_IN_BIPS");
    bytes32 private constant STAKE_THRESHOLD = keccak256("STAKE_THRESHOLD");
    bytes32 private constant UNSTAKE_THRESHOLD = keccak256("UNSTAKE_THRESHOLD");
    bytes32 private constant STAKE_BATCH_MAX_WAIT_TIME = keccak256("STAKE_BATCH_MAX_WAIT_TIME");
    bytes32 private constant UNSTAKE_BATCH_MAX_WAIT_TIME = keccak256("UNSTAKE_BATCH_MAX_WAIT_TIME");
    bytes32 private constant MIN_STAKERS_IN_BATCH = keccak256("MIN_STAKERS_IN_BATCH");
    bytes32 private constant MIN_UNSTAKERS_IN_BATCH = keccak256("MIN_UNSTAKERS_IN_BATCH");

    modifier onlySubstakeVault() {
        if (msg.sender == getSubstakeVault()) {
            _;
        }
    }

    ExchangeRate exchangeRate;
    mapping(bytes32 => address) contractsMap;
    mapping(bytes32 => uint256) uint256Map;
    mapping(bytes32 => address payable) addressMap;

    function initialize(address _admin, uint256 _lidoExRate) external initializer {
        SubstakeLib.zeroAddressCheck(_admin);
        SubstakeLib.zeroCheck(_lidoExRate);
        exchangeRate.lidoExRate = _lidoExRate;
        __AccessControl_init();
        _setAdmin(_admin);
        _setContract(SCROLL_L2_ETH_GATEWAY, 0xd0e400Ec6Ed9C803A9D9D3a602494393E806F823);
        _setContract(SUBSTAKE_L1_MANAGER, 0xd0e400Ec6Ed9C803A9D9D3a602494393E806F823);
        _setContract(SUBSTAKE_VAULT, 0xd0e400Ec6Ed9C803A9D9D3a602494393E806F823);
        _setAddress(FEE_COLLECTOR, 0x55d9a0d367866a102eD85EA76CE46B11E62b3E88);
        _setUint(STAKING_FEES_IN_BIPS, 50); // 0.5%
        _setUint(UNSTAKING_FEES_IN_BIPS, 100); // 1%
        _setUint(STAKE_THRESHOLD, 10000000000000000); // 0.01 ETH
        _setUint(UNSTAKE_THRESHOLD, 10000000000000000); // 0.01 SUB
        _setUint(STAKE_BATCH_MAX_WAIT_TIME, 10800); // 3 Hr
        _setUint(UNSTAKE_BATCH_MAX_WAIT_TIME, 10800); // 3 Hr
        _setUint(MIN_STAKERS_IN_BATCH, 2);
        _setUint(MIN_UNSTAKERS_IN_BATCH, 2);
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    function updateTotalETH(uint256 _newValue) external override onlySubstakeVault {
        exchangeRate.totalETH = _newValue;
    }

    function updateTotalSubToken(uint256 _newValue) external override onlySubstakeVault {
        exchangeRate.totalSubToken = _newValue;
    }

    function updateLidoExRate(uint256 _newValue) external override onlySubstakeVault {
        exchangeRate.lidoExRate = _newValue;
    }

    function updateEthInTransit(uint256 _newValue) external override onlySubstakeVault {
        exchangeRate.ethInTransit = _newValue;
    }

    function updateTotalWstETH(uint256 _newValue) external override onlySubstakeVault {
        exchangeRate.totalwstETH = _newValue;
    }

    function updateSubstakeVault(address _newAddress) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setContract(SUBSTAKE_VAULT, _newAddress);
    }

    function updateScrollL2ETHGateway(address _newAddress) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setContract(SCROLL_L2_ETH_GATEWAY, _newAddress);
    }

    function updateSubstakeL1Manager(address _newAddress) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setContract(SUBSTAKE_L1_MANAGER, _newAddress);
    }

    function updateStakingFee(uint256 _newValue) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setUint(STAKING_FEES_IN_BIPS, _newValue);
    }

    function updateUnstakingFee(uint256 _newValue) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setUint(UNSTAKING_FEES_IN_BIPS, _newValue);
    }

    function updateStakeThreshold(uint256 _newValue) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setUint(STAKE_THRESHOLD, _newValue);
    }

    function updateUnstakeThreshold(uint256 _newValue) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setUint(UNSTAKE_THRESHOLD, _newValue);
    }

    function updateStakeBatchMaxWaitTime(uint256 _newValue) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setUint(STAKE_BATCH_MAX_WAIT_TIME, _newValue);
    }

    function updateUnstakeBatchMaxWaitTime(uint256 _newValue) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setUint(UNSTAKE_BATCH_MAX_WAIT_TIME, _newValue);
    }

    function updateMinStakersInBatch(uint256 _newValue) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setUint(MIN_STAKERS_IN_BATCH, _newValue);
    }

    function updateMinUnstakersInBatch(uint256 _newValue) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setUint(MIN_UNSTAKERS_IN_BATCH, _newValue);
    }

    function updateFeeCollector(address _newAddress) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setAddress(FEE_COLLECTOR, _newAddress);
    }

    function getSubstakeVault() public view override returns (address) {
        return contractsMap[SUBSTAKE_VAULT];
    }

    function getScrollL2ETHGateway() external view override returns (address) {
        return contractsMap[SCROLL_L2_ETH_GATEWAY];
    }

    function getSubstakeL1Manager() public view override returns (address) {
        return contractsMap[SUBSTAKE_L1_MANAGER];
    }

    function getStakingFee() public view override returns (uint256) {
        return uint256Map[STAKING_FEES_IN_BIPS];
    }

    function getUnstakingFee() public view override returns (uint256) {
        return uint256Map[UNSTAKING_FEES_IN_BIPS];
    }

    function getStakeThreshold() external view override returns (uint256) {
        return uint256Map[STAKE_THRESHOLD];
    }

    function getUnstakeThreshold() external view override returns (uint256) {
        return uint256Map[UNSTAKE_THRESHOLD];
    }

    function getStakeBatchMaxWaitTime() external view override returns (uint256) {
        return uint256Map[STAKE_BATCH_MAX_WAIT_TIME];
    }

    function getUnstakeBatchMaxWaitTime() external view override returns (uint256) {
        return uint256Map[UNSTAKE_BATCH_MAX_WAIT_TIME];
    }

    function getMinStakersInBatch() external view override returns (uint256) {
        return uint256Map[MIN_STAKERS_IN_BATCH];
    }

    function getMinUnstakersInBatch() external view override returns (uint256) {
        return uint256Map[MIN_UNSTAKERS_IN_BATCH];
    }

    function getExchangeRateData() external view override returns (ExchangeRate memory) {
        return exchangeRate;
    }

    function getFeeCollector() external view override returns (address payable) {
        return addressMap[FEE_COLLECTOR];
    }

    function getAdmin() public view override returns (address) {
        return SubstakeLib.getAddressSlot(ADMIN).value;
    }

    function updateAdmin(address _admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        SubstakeLib.zeroAddressCheck(_admin);
        address oldAdmin = getAdmin();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _setAdmin(_admin);
        _revokeRole(DEFAULT_ADMIN_ROLE, oldAdmin);
    }

    function _setAdmin(address _admin) internal {
        SubstakeLib.getAddressSlot(ADMIN).value = _admin;
    }

    function computeFees(uint256 _amount, uint8 _type) external view returns (uint256) {
        return ((_type == 0) ? ((getStakingFee() * _amount) / 10000) : (getUnstakingFee() * _amount) / 10000);
    }

    function _setContract(bytes32 key, address val) internal {
        SubstakeLib.zeroAddressCheck(val);
        if (contractsMap[key] == val) {
            revert IdenticalValue();
        }
        contractsMap[key] = val;
    }

    function _setAddress(bytes32 key, address val) internal {
        SubstakeLib.zeroAddressCheck(val);
        if (addressMap[key] == payable(val)) {
            revert IdenticalValue();
        }
        contractsMap[key] = val;
    }

    function _setUint(bytes32 key, uint256 val) internal {
        SubstakeLib.zeroCheck(val);
        if (uint256Map[key] == val) {
            revert IdenticalValue();
        }
        uint256Map[key] = val;
    }
}
