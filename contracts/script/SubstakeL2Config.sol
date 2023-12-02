
 
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {Script} from "forge-std/Script.sol";
import {SubstakeL2Config} from "../src/L2/SubstakeL2Config.sol";

contract SubstakeL2ConfigScript is Script {

    address admin = 0x22b6Dd4D6d818e2Ebce3D2E009A249F8FbF4e965;

    function run() public returns (SubstakeL2Config) {
        vm.startBroadcast();
        SubstakeL2Config substakeL2Config = new SubstakeL2Config();
        vm.stopBroadcast();
        return substakeL2Config;
    }
}