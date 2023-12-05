// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

interface ISubstakeL1Config {

    error IdenticalValue();
    error ZeroValue();

    function updateSubstakeVault(address) external;
    function updateLidoWstEthToken(address) external;
    function updateUniswap_wstETH_wETH_pool(address) external;
    function updateWeth(address) external;
    function updateUniswapSwapDeadline(uint256) external;
    function updateUniswapSwapRouter(address) external;
    function updateUniswapPoolFee(uint256) external;
    function updateScrollL1Messenger(address) external;
    function updateScrollL1ETHGateway(address) external;
    function updateScrollL1MessageQueue(address) external;
    function updateSwapSlipage(uint256) external;


    function getSubstakeVault() external returns (address);
    function getUniswap_wstETH_wETH_pool() external returns (address);
    function getWeth() external returns (address);
    function getUniswapSwapDeadline() external returns (uint256);
    function getUniswapSwapRouter() external returns (address);
    function getUniswapPoolFee() external returns (uint256);
    function getLidoWstETHToken() external view returns (address);
    function getScrollL1Messenger() external view returns(address);
    function getScrollL1ETHGateway() external view returns(address);
    function getScrollL1MessageQueue() external view returns(address);
    function getSwapSlipage() external view returns(uint256);
}
