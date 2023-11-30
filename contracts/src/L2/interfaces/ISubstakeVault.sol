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

    // Events

    event Deposit(address indexed sender, address indexed owner, uint256 assets, uint256 shares);
    event Withdraw(
        address indexed sender, address indexed receiver, address indexed owner, uint256 assets, uint256 shares
    );
    event BatchSentToL1(uint256 indexed stakeBatch, uint8 indexed batchType, uint256 amount, address l1Recipient);

    function asset() external view returns (address);
    function totalAssets() external view returns (uint256);
    function convertToShares(uint256 assets) external view returns (uint256);
    function convertToAssets(uint256 shares) external view returns (uint256);
    function maxDeposit(address receiver) external view returns (uint256);
    function maxMint(address receiver) external view returns (uint256);
    function maxRedeem(address owner) external view returns (uint256);
    function previewDeposit(uint256 assets) external view returns (uint256);
    function previewMint(uint256 shares) external view returns (uint256);
    function previewWithdraw(uint256 assets) external view returns (uint256);
    function previewRedeem(uint256 shares) external view returns (uint256);
    function maxWithdraw(address owner) external view returns (uint256);
    function deposit(uint256 assets, address receiver) external returns (uint256, uint256);
    function mint(uint256 shares, address receiver) external returns (uint256, uint256);
    function withdraw(uint256 assets, address receiver, address owner) external returns (uint256, uint256);
    function redeem(uint256 shares, address receiver, address owner) external returns (uint256, uint256);
}
