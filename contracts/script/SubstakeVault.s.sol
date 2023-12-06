// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {SubstakeVault} from "../src/L2/SubstakeVault.sol";

contract SubstakeVaultScript is Script {
    function run() public returns (SubstakeVault) {
        vm.startBroadcast();
        SubstakeVault substakeVault = new SubstakeVault();
              //For Local Testing Purpose
        vm.deal(address(substakeVault), 100000000000000000000);
        address _admin = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        address _substakel2Config = 0x4C4a2f8c81640e47606d3fd77B353E87Ba015584;
        substakeVault.initialize(_admin, _substakel2Config);
        ////////
        vm.stopBroadcast();
        return substakeVault;
    }
}
