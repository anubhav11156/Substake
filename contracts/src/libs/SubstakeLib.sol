// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

library SubstakeLib {
    error ZeroAddress();
    error ZeroValue();
    error callerNotManager();
    error callerNotHashstackContract();

    struct bytes32Slots {
        bytes32 value;
    }

    struct addressSlot {
        address value;
    }

    struct uint256Slot {
        uint256 value;
    }

    function zeroAddressCheck(address _address) internal pure {
        if (_address == address(0)) revert ZeroAddress();
    }

    function zeroCheck(uint256 _uint) internal pure {
        if (_uint == 0) revert ZeroValue();
    }

    function getBytes32Slot(bytes32 slot) internal pure returns (bytes32Slots storage r) {
        assembly {
            r.slot := slot
        }
    }

    function getAddressSlot(bytes32 slot) internal pure returns (addressSlot storage r) {
        assembly {
            r.slot := slot
        }
    }

    function getUint256Slot(bytes32 slot) internal pure returns (uint256Slot storage r) {
        assembly {
            r.slot := slot
        }
    }

    function bytes32ToAddressMapping(bytes32 slot)
        internal
        pure
        returns (mapping(bytes32 => address) storage randomVariable)
    {
        bytes32 location = slot;
        assembly {
            randomVariable.slot := location
        }
    }

    function bytes32ToUintMapping(bytes32 slot)
        internal
        pure
        returns (mapping(bytes32 => uint256) storage randomVariable)
    {
        bytes32 location = slot;
        assembly {
            randomVariable.slot := location
        }
    }

    function addressToBytes32(address _addr) external pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function bytes32ToAddress(bytes32 _buf) external pure returns (address) {
        return address(uint160(uint256(_buf)));
    }
}
