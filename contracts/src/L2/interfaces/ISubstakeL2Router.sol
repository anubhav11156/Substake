// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

interface ISubstakeL2Router {
    function sendMessageToL1(bytes calldata _data, address _to, uint256 _value) external payable;
    function withdrawEthFromRouter(uint256 _ethAmount) external;
}
