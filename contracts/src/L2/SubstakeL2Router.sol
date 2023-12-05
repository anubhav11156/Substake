// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../libs/SubstakeLib.sol";
import "@scroll-tech/contracts/L2/gateways/IL2ETHGateway.sol";
import "@scroll-tech/contracts/L2/IL2ScrollMessenger.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {ISubstakeL2Config} from "./interfaces/ISubstakeL2Config.sol";
import {ISubstakeL2Router} from "./interfaces/ISubstakeL2Router.sol";

uint256 constant GAS_LIMIT = 0;

contract SubstakeL2Router is ISubstakeL2Router, AccessControlUpgradeable {
    ISubstakeL2Config public substakeL2Config;

    bytes32 private constant ADMIN = keccak256("ADMIN");

    function initialize(address _admin, address _substakeL2Config) external initializer {
        SubstakeLib.zeroAddressCheck(_substakeL2Config);
        SubstakeLib.zeroAddressCheck(_admin);
        _setAdmin(_admin);
        substakeL2Config = ISubstakeL2Config(_substakeL2Config);
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    function sendEthAndMessage(uint256 _ethAmount, bytes calldata _data, address _to, uint256 _fee)
        external
        payable
        override
    {
        require(_ethAmount == msg.value, "Insufficient ethAmount");
        require(_ethAmount + _fee <= routerBalance(), "Insufficient router balance!");
        IL2ETHGateway(substakeL2Config.getScrollL2ETHGateway()).withdrawETH{value: _ethAmount}(
            _to, _ethAmount, GAS_LIMIT
        );
        IL2ScrollMessenger(substakeL2Config.getScrollL2Messenger()).sendMessage{value: _fee}(
            _to, _fee, _data, GAS_LIMIT
        );
    }

    function sendOnlyMessage(bytes calldata _data, address _to, uint256 _fee) external payable override {
        require(_fee <= routerBalance(), "Insufficient router balance!");
        IL2ScrollMessenger(substakeL2Config.getScrollL2Messenger()).sendMessage{value: _fee}(
            _to, _fee, _data, GAS_LIMIT
        );
    }

    function withdrawEthFromRouter(uint256 _ethAmount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_ethAmount > 0, "zero ETH withdraw");
        require(_ethAmount <= routerBalance(), "Insufficient router balance");
        payable(getAdmin()).transfer(_ethAmount);
    }

    function routerBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getAdmin() public view returns (address) {
        return SubstakeLib.getAddressSlot(ADMIN).value;
    }

    function _setAdmin(address _admin) internal {
        SubstakeLib.getAddressSlot(ADMIN).value = _admin;
    }

    function updateAdmin(address _admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        SubstakeLib.zeroAddressCheck(_admin);
        address oldAdmin = getAdmin();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _setAdmin(_admin);
        _revokeRole(DEFAULT_ADMIN_ROLE, oldAdmin);
    }

    fallback() external payable {}
    receive() external payable {}
}
