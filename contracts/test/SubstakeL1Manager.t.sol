// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Test, console2} from "forge-std/Test.sol";
import {SubstakeL1Manager} from "../src/L1/SubstakeL1Manager.sol";
import {SubstakeL1ManagerScript} from "../script/SubstakeL1Manager.s.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";


contract SubstakeL1ManagerTest is Test {
    SubstakeL1Manager substakeVault;
    function setUp() external {
        SubstakeL1ManagerScript deployer = new SubstakeL1ManagerScript();
        substakeVault = deployer.run();
    }    


    function test_stakeToLido() public {
        
    }
}