// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {SubstakeL2Config} from "../src/L2/SubstakeL2Config.sol";

contract SubstakeL2ConfigScript is Script {
    function run() public returns (SubstakeL2Config) {
        vm.startBroadcast();
        SubstakeL2Config substakeL2Config = new SubstakeL2Config();
        vm.stopBroadcast();
        return substakeL2Config;
    }
}
