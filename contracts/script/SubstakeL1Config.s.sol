// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {SubstakeL1Config} from "../src/L1/SubstakeL1Config.sol";

contract L1ConfigScript is Script {
    
    address admin = 0x55d9a0d367866a102eD85EA76CE46B11E62b3E88;

    function run() public returns (SubstakeL1Config) {
        vm.startBroadcast();
        SubstakeL1Config l1Config = new SubstakeL1Config(admin);
        vm.stopBroadcast();
        return l1Config;
    }
}