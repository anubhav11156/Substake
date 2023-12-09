// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {SubstakeL1Manager} from "../src/L1/SubstakeL1Manager.sol";

contract SubstakeL1ManagerScript is Script {

    address admin = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address substakeL1Config = 0x1c1521cf734CD13B02e8150951c3bF2B438be780;
    function run() public returns (SubstakeL1Manager) {
        vm.startBroadcast();
        SubstakeL1Manager l1Manager = new SubstakeL1Manager();
        vm.deal(address(l1Manager), 50000000000000000000);
        l1Manager.initialize(admin, substakeL1Config);
        vm.stopBroadcast();
        return l1Manager;
    }
}
