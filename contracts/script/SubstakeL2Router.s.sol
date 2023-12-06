// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {SubstakeL2Router} from "../src/L2/SubstakeL2Router.sol";

contract SubstakeL2RouterScript is Script {
    function run() public returns (SubstakeL2Router) {
        vm.startBroadcast();
        SubstakeL2Router substakeL2Router = new SubstakeL2Router();
        // For testing purpose
        // vm.deal(address(substakeL2Router), 100000000000000000000);
        address _admin = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        address _substakel2Config = 0x4C4a2f8c81640e47606d3fd77B353E87Ba015584;
        substakeL2Router.initialize(_admin, _substakel2Config);
        // 
        vm.stopBroadcast();
        return substakeL2Router;
    }
}


// Router address : 0xD8a5a9b31c3C0232E196d518E89Fd8bF83AcAd43