// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

interface IwstETH {
    function tokensPerStEth() external returns (uint256);
    function getWstETHByStETH(uint256) external returns (uint256);
    function balanceOf(address) external returns (uint256);
    function totalSupply() external returns (uint256);
    function approve(address, uint256) external;
}
