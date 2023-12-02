// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {Script} from "forge-std/Script.sol";
import {SubstakeVault} from "../src/L2/SubstakeVault.sol";
// /Users/surfer/Desktop/Substake/Substake/Contracts/src/L2/SubstakeVault.sol

contract SubstakeVaultScript is Script {

    // address admin = 0x22b6Dd4D6d818e2Ebce3D2E009A249F8FbF4e965;

    function run() public returns (SubstakeVault) {
        vm.startBroadcast();
        SubstakeVault substakeVault = new SubstakeVault();
        vm.stopBroadcast();
        return substakeVault;
    }
}