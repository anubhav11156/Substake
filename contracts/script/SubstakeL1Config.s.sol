// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {SubstakeL1Config} from "../src/L1/SubstakeL1Config.sol";

contract L1ConfigScript is Script {

    function run() public returns (SubstakeL1Config) {
        vm.startBroadcast();
        SubstakeL1Config l1Config = new SubstakeL1Config();
        vm.stopBroadcast();
        return l1Config;
    }
}
