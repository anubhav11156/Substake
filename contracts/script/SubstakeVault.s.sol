// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {SubstakeVault} from "../src/L2/SubstakeVault.sol";

contract SubstakeVaultScript is Script {
    function run() public returns (SubstakeVault) {
        vm.startBroadcast();
        SubstakeVault substakeVault = new SubstakeVault();
        vm.stopBroadcast();
        return substakeVault;
    }
}
