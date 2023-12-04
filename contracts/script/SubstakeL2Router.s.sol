// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {SubstakeL2Router} from "../src/L2/SubstakeL2Router.sol";

contract SubstakeL2RouterScript is Script {

    function run() public returns (SubstakeL2Router) {
        vm.startBroadcast();
        SubstakeL2Router substakeL2Router = new SubstakeL2Router();
        vm.stopBroadcast();
        return substakeL2Router;
    }
}