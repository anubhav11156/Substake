// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

interface ISubstakeL2Router {
    function sendEthAndMessage(uint256 _ethAmount, bytes calldata _data, address _to, uint256 _fee) external payable;
    function sendOnlyMessage(bytes calldata _data, address _to, uint256 _fee) external payable;
    function withdrawEthFromRouter(uint256 _ethAmount) external;
}
