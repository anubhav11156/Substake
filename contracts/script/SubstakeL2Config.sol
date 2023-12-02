
 
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {Script} from "forge-std/Script.sol";
import {SubstakeL2Config} from "../src/L2/SubstakeL2Config.sol";

contract SubstakeL2ConfigScript is Script {

    address admin = 0x55d9a0d367866a102eD85EA76CE46B11E62b3E88;

    function run() public returns (SubstakeL2Config) {
        vm.startBroadcast();
        SubstakeL2Config substakeL2Config = new SubstakeL2Config();
        vm.stopBroadcast();
        return substakeL2Config;
    }
}