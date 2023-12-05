// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../../libs/SubstakeLib.sol";
import "@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol";

interface ISubstakeL1Manager {

    error ZeroAmount();
    error InsufficientBridigingFee();
    error InsufficientContractBalance();
    error InsufficientWstETH();
    error InsufficientETHx();
    error InvalidOperation();
    error ZeroAddress();
    error BatchAlreadyUsed();

    event Staked(uint256 amount, uint256 shares, uint256 batchId);
    event Unstaked(uint256 amount, uint256 shares, uint256 batchId);
    event EthReceived(uint256 amount, address);
    event MessageSent(address sender, address receiver, uint256[] message);
    event MessageReceived(address sender, address receiver, uint256[] message);
    event MessageSentToL2(address l2Recipient, uint256 batchType, bytes payload);
}
