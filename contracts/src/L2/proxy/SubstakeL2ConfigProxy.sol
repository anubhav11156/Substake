// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import "../../libs/SubstakeLib.sol";

contract SubstakeL2ConfigProxy {
    bytes32 private constant IMPLEMENTATION_SLOT = bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1);
    bytes32 private constant ADMIN_SLOT = bytes32(uint256(keccak256("eip1967.proxy.admin")) - 1);

    constructor(address admin) {
        SubstakeLib.zeroAddressCheck(admin);
        _setAdmin(admin);
    }

    modifier ifAdmin() {
        if (msg.sender == _getAdmin()) {
            _;
        } else {
            /*
                Forward call to implementation contract
            */
            _fallback();
        }
    }

    // @mark_audit_note
    // Why not call initialize on constructor?
    function changeAdmin(address admin) external ifAdmin {
        _setAdmin(admin);
    }

    function _getImplementation() private view returns (address) {
        return SubstakeLib.getAddressSlot(IMPLEMENTATION_SLOT).value;
    }

    function _setImplementation(address implementation) private {
        require(implementation.code.length > 0, "Not an contract address");
        SubstakeLib.getAddressSlot(IMPLEMENTATION_SLOT).value = implementation;
    }

    function _getAdmin() private view returns (address) {
        return SubstakeLib.getAddressSlot(ADMIN_SLOT).value;
    }

    function _setAdmin(address admin) private {
        SubstakeLib.getAddressSlot(ADMIN_SLOT).value = admin;
    }

    function upgradeImplementation(address _newImplementation) external ifAdmin {
        _setImplementation(_newImplementation);
    }

    function _admin() external view returns (address) {
        return _getAdmin();
    }

    function _implementation() external view returns (address) {
        return _getImplementation();
    }

    function _delegate(address implementation) private {
        assembly {
            // load the calldata to memory
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := delegatecall(gas(), implementation, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            // delegatecall returns 0 on error.
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    function _fallback() private {
        _beforeFallback();
        _delegate(_getImplementation());
    }

    fallback() external payable {
        _fallback();
    }

    receive() external payable {
        _fallback();
    }

    function _beforeFallback() internal virtual {}
}