// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {SubstakeL1Config} from "../src/L1/SubstakeL1Config.sol";

contract SubstakeL1ConfigScript is Script {
    address admin = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    function run() public returns (SubstakeL1Config) {
        vm.startBroadcast();
        SubstakeL1Config substakel1Config = new SubstakeL1Config();
        substakel1Config.initialize(admin);
        vm.stopBroadcast();
        return substakel1Config;
    }
}
