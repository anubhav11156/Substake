// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../libs/SubstakeLib.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
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

    function initialize(address _admin, address _substakeL2Config) external initializer {
        SubstakeLib.zeroAddressCheck(_admin);
        SubstakeLib.zeroAddressCheck(_substakeL2Config);
        substakeL2Config = ISubstakeL2Config(_substakeL2Config);
        __ERC20_init('SubToken', 'SUB');
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _createNewStakeBatch();
        _createNewUnstakeBatch();
    }

    mapping (uint256 => StakeBatch) batchIdToStakeBatch;
    mapping (uint256 => UnstakeBatch) batchIdToUnstakeBatch;
    mapping (uint256 => mapping(address => uint256)) unstakersSUBToken;
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
