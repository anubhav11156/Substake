// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {SubstakeL2Config} from "../src/L2/SubstakeL2Config.sol";

contract SubstakeL2ConfigScript is Script {
    function run() public returns (SubstakeL2Config) {
        vm.startBroadcast();
        SubstakeL2Config substakeL2Config = new SubstakeL2Config();
        // For testing purpose
        // vm.deal(address(substakeL2Config), 100000000000000000000);
        address _admin = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        uint256 _lidoExRate = 870396997775373311;
        substakeL2Config.initialize(_admin, _lidoExRate);
        //
        vm.stopBroadcast();
        return substakeL2Config;
    }
}
