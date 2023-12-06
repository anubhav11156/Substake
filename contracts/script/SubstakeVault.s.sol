// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {SubstakeVault} from "../src/L2/SubstakeVault.sol";

contract SubstakeVaultScript is Script {
    function run() public returns (SubstakeVault) {
        vm.startBroadcast();
        SubstakeVault substakeVault = new SubstakeVault();
              //For Local Testing Purpose
        // vm.deal(address(substakeVault), 100000000000000000000);
        address _admin = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        address _substakel2Config = 0x8198f5d8F8CfFE8f9C413d98a0A55aEB8ab9FbB7;
        substakeVault.initialize(_admin, _substakel2Config);
        ////////
        vm.stopBroadcast();
        return substakeVault;
    }
}
