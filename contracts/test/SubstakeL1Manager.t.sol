// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Test, console2} from "forge-std/Test.sol";
import {SubstakeL1Manager} from "../src/L1/SubstakeL1Manager.sol";
import {SubstakeL1ManagerScript} from "../script/SubstakeL1Manager.s.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";


contract SubstakeL1ManagerTest is Test {
    SubstakeL1Manager substakeL1Manager;
    function setUp() external {
        SubstakeL1ManagerScript deployer = new SubstakeL1ManagerScript();
        substakeL1Manager = deployer.run();
    }    


    function test_stakeToLido() public {
        address admin = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        uint256 _amount = 2000000000000000000; // 2 ETH
        uint256 _stakeBatchID = 1;

        console2.log("Stake Batch ETH amount : ", _amount);
        vm.prank(admin);
        uint256 shares = substakeL1Manager.stakeToLido(_amount, _stakeBatchID);
        console2.log("Shares returned   : ", shares);
    }
}