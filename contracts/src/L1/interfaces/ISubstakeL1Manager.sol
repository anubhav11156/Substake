// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import "../../libs/SubstakeLib.sol";
// import "@hyperlane-xyz/core/contracts/interfaces/IMessageRecipient.sol";
import "@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol";
// import '@uniswap/v3-peiphery/contracts/'

interface IL1Manager {
    // IUniswapV3SwapCallback

    error ZeroAmount();
    error InsufficientBridigingFee();
    error InsufficientContractBalance();
    error InsufficientWstETH();
    error InsufficientETHx();
    error InvalidOperation();
    error ZeroAddress();
    error BatchAlreadyUsed();

    event WithdrawFromStarkgateBrigde(uint256 amount, address receiver, string token);
    event DepositToStarkgateBridge(uint256 amount, uint256 receiver, string token);
    event UpdatedHashstackConfig(address hashstackConfig);
    event Staked(uint256 amount, uint256 shares, uint256 batchId, uint256 protocol);
    event Unstaked(uint256 amount, uint256 shares, uint256 batchId, uint256 protocol);
    event EthReceived(uint256 amount, address);
    event MessageSent(address sender, address receiver, uint256[] message);
    event MessageReceived(address sender, address receiver, uint256[] message);
}
