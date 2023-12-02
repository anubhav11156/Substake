// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

interface IL1Config {
    error IdenticalValue();
    error ZeroValue();

    function updateSubstakeVault(address) external;
    function updateLidoWstEthToken(address) external;
    function updateUniswap_wstETH_wETH_pool(address) external;
    function updateWeth(address) external;
    function updateUniswapSwapDeadline(uint256) external;
    function updateUniswapSwapRouter(address) external;
    function updateUniswapPoolFee(uint256) external;
    // function updateHyperlaneFees(uint256) external;
    // function updateHyperlanceMailBoxL1(address) external;
    // function updateHyperlanceMailBoxL2(address) external;

    function getSubstakeVault() external returns (address);
    function getL1ManagerWstETHBalance(address) external returns (uint256);
    function getUniswap_wstETH_wETH_pool() external returns (address);
    function getWeth() external returns (address);
    function getUniswapSwapDeadline() external returns (uint256);
    function getUniswapSwapRouter() external returns (address);
    function getUniswapPoolFee() external returns (uint256);
    // function getHyperlaneFee() external returns (uint256);
    // function hyperlaneMailboxL1() external returns (address);
    // function hyperlaneMailboxL2() external returns (address);
    function getLidoWstETHToken() external returns (address);
}
