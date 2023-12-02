// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

interface IMailbox {
    function quoteDispatch(uint32 destination, bytes32 recipient, bytes calldata body) external returns (uint256 fee);

    function dispatch(uint32 destination, bytes32 recipient, bytes calldata body) external payable; // will revert if msg.value < quoted fee
}
