// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

interface IwstETH {
    function getStETHByWstETH(uint256) external view returns (uint256);
    function getWstETHByStETH(uint256) external view returns (uint256);
    function tokensPerStEth() external view returns (uint256);
    function balanceOf(address) external view returns (uint256);
    function totalSupply() external view returns (uint256);
    function approve(address, uint256) external;
}
