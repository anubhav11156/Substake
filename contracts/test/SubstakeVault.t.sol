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

    // function test_dispatchStakeBatch() public {
    //     uint256 ethBalBefore = substakeVault.vaultBalance();
    //     console2.log("ETH balance",ethBalBefore);
    //     vm.prank(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
    //     substakeVault.dispatchStakeBatch();
    //     console2.log("Here");
    // }

    function test_deposit() public {
        uint256 ethBalBefore = substakeVault.vaultBalance();
        console2.log("ETH balance",ethBalBefore);
        uint256 amount = 100000000000000000;
        address _receiver = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        uint256 userSUBbalanceBefore = substakeVault.balanceOf(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        console2.log("User SUB balance before : ",userSUBbalanceBefore);
        vm.prank(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        (uint256 _shares, uint256 _stakeBatchId ) = substakeVault.deposit{value:amount}(amount, _receiver);
        console2.log("StakeBatchId",_stakeBatchId);
        // assertEq(_stakeBatchId, substakeVault.activeStakeBatch(),"Incorrect bathcId");
        console2.log("SUB shares", _shares);

    }

    
}