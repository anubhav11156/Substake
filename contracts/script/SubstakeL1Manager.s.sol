// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {SubstakeL1Manager} from "../src/L1/SubstakeL1Manager.sol";

contract L1ManagerScript is Script {
    function run() public returns (SubstakeL1Manager) {
        vm.startBroadcast();
        SubstakeL1Manager l1Manager = new SubstakeL1Manager();
        vm.stopBroadcast();
        return l1Manager;
    }
}
