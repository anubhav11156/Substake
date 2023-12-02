// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import {Script, console2} from "forge-std/Script.sol";
import {SubstakeL1Config} from "../src/L1/SubstakeL1Config.sol";

contract L1ConfigScript is Script {
    
    address admin = 0x22b6Dd4D6d818e2Ebce3D2E009A249F8FbF4e965;

    function run() public returns (SubstakeL1Config) {
        vm.startBroadcast();
        SubstakeL1Config l1Config = new SubstakeL1Config(admin);
        vm.stopBroadcast();
        return l1Config;
    }
}