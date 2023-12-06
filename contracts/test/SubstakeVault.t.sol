// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {Test, console2} from "forge-std/Test.sol";
import {SubstakeVault} from "../src/L2/SubstakeVault.sol";
import {SubstakeVaultScript} from "../script/SubstakeVault.s.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";


contract SubstakeVaultTest is Test {
    SubstakeVault substakeVault;
    function setUp() external {
        SubstakeVaultScript deployer = new SubstakeVaultScript();
        substakeVault = deployer.run();
    }

    function test_dispatchStakeBatch() public {
        uint256 ethBalBefore = substakeVault.vaultBalance();
        console2.log("ETH balance",ethBalBefore);
        vm.prank(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        substakeVault.dispatchStakeBatch();
        console2.log("Here");
    }
}