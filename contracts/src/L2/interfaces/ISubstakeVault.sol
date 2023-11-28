// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../../libs/SubstakeLib.sol";

interface ISubstakeVault {
    // Errors
    error ZeroAmount();
    error ZeroShares();
    error InsufficientMessagingFee();
    error InsufficientETH();
    error InsufficientWstETH();
    error InvalidOperation();
    error ZeroAddress();
    error ApprovalFailed();
    error TransactionFailed();
    error IdenticalValue();
}
