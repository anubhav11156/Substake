// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import "./interfaces/ISubstakeL1Config.sol";
import "./interfaces/IwstETH.sol";
import "../libs/SubstakeLib.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

/*
    Mainnet Contract Address :
        Uniswap wstETH/wETH Pool = 0x109830a1AAaD605BbF02a9dFA7B0B92EC2FB7dAa
        Balancer ETHx/wETH Pool = 0x37b18B10ce5635a84834b26095A0AE5639dCB752
         -> getPoolId()
        Balaner ETHx/wETH PoolId = 0x37b18b10ce5635a84834b26095a0ae5639dcb7520000000000000000000005cb 
        Balancer Vault = 0xBA12222222228d8Ba445958a75a0704d566BF2C8
        stader ETHx : 0xA35b1B31Ce002FBF2058D22F30f95D405200A15b | upgradable contract
        Lido wstETH : 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0 | not upgradable
        starknet core contract : 0xc662c410C0ECf747543f5bA90660f6ABeBD9C8c4
        starkgate ETH bridge : 0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419
        weth contract : 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
        uniswap swap Router : 0xE592427A0AEce92De3Edee1F18E0157C05861564
*/

contract SubstakeL1Config is IL1Config, AccessControlUpgradeable {
    bytes32 private constant ADMIN = keccak256("ADMIN");
    bytes32 private constant LIDO_WSTETH_TOKEN = keccak256("LIDO_WSTETH_TOKEN");
    bytes32 private constant UNISWAP_WSTETH_WETH_POOL = keccak256("UNISWAP_WSTETH_WETH_POOL");
    bytes32 private constant WETH_CONTRACT = keccak256("WETH_CONTRACT");
    bytes32 private constant UINIWAP_SWAP_DEADLINE = keccak256("UINIWAP_SWAP_DEADLINE");
    bytes32 private constant UNISWAP_SWAP_ROUTER = keccak256("UNISWAP_SWAP_ROUTER");
    bytes32 private constant UNISWAP_POOL_FEE = keccak256("UNISWAP_POOL_FEE");
    bytes32 private constant SUBSTAKE_VAULT = keccak256("SUBSTAKE_VAULT");
    bytes32 private constant SUBSTAKE_L2_ROUTER = keccak256("SUBSTAKE_L2_ROUTER");

    function initialize(address _admin) external initializer {
        SubstakeLib.zeroAddressCheck(_admin);
        _setAdmin(_admin);
        _setContract(LIDO_WSTETH_TOKEN, 0x6320cD32aA674d2898A68ec82e869385Fc5f7E2f);
        _setContract(UNISWAP_WSTETH_WETH_POOL, 0x109830a1AAaD605BbF02a9dFA7B0B92EC2FB7dAa);
        _setContract(WETH_CONTRACT, 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
        _setContract(UNISWAP_SWAP_ROUTER, 0xE592427A0AEce92De3Edee1F18E0157C05861564);
        _setContract(SUBSTAKE_VAULT, 0xE592427A0AEce92De3Edee1F18E0157C05861564);
        _setContract(SUBSTAKE_L2_ROUTER, 0x4ceBC071291125dffc07Fb2b57d2B96c9FB32bCD);
        _setUint(UNISWAP_POOL_FEE, 100); // 0.01%
        _setUint(UINIWAP_SWAP_DEADLINE, 600); // 12 hr
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    mapping(bytes32 => address) contractsMap;
    mapping(bytes32 => uint256) uint256Map;
    mapping(bytes32 => address payable) addressMap;

    function updateLidoWstEthToken(address _newAddress) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setContract(LIDO_WSTETH_TOKEN, _newAddress);
    }

    function updateUniswap_wstETH_wETH_pool(address _newAddress) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setContract(UNISWAP_WSTETH_WETH_POOL, _newAddress);
    }

    function updateWeth(address _newAddress) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setContract(WETH_CONTRACT, _newAddress);
    }

    function updateUniswapSwapRouter(address _newAddress) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setContract(UNISWAP_SWAP_ROUTER, _newAddress);
    }

    function updateSubstakeVault(address _newAddress) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setContract(SUBSTAKE_VAULT, _newAddress);
    }

    function updateUniswapSwapDeadline(uint256 _newDeadline) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setUint(UINIWAP_SWAP_DEADLINE, _newDeadline);
    }

    function updateUniswapPoolFee(uint256 _newPoolFee) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _setUint(UNISWAP_POOL_FEE, _newPoolFee);
    }

    function getUniswap_wstETH_wETH_pool() external view override returns (address) {
        return contractsMap[UNISWAP_WSTETH_WETH_POOL];
    }

    function getUniswapSwapRouter() external view override returns (address) {
        return contractsMap[UNISWAP_SWAP_ROUTER];
    }

    function getSubstakeVault() external view override returns (address) {
        return contractsMap[SUBSTAKE_VAULT];
    }

    function getUniswapSwapDeadline() external view override returns (uint256) {
        return uint256Map[UINIWAP_SWAP_DEADLINE];
    }

    function getUniswapPoolFee() external view override returns (uint256) {
        return SubstakeLib.getUint256Slot(UNISWAP_POOL_FEE).value;
    }

    function getLidoWstETHToken() public view returns (address) {
        return contractsMap[LIDO_WSTETH_TOKEN];
    }

    function getWeth() public view returns (address) {
        return contractsMap[WETH_CONTRACT];
    }

    function getL1ManagerWstETHBalance(address _address) external override returns (uint256) {
        return (IwstETH(getLidoWstETHToken()).balanceOf(_address));
    }


    function _setAdmin(address _admin) internal {
        SubstakeLib.getAddressSlot(ADMIN).value = _admin;
    }

    function getAdmin() public view returns (address) {
        return SubstakeLib.getAddressSlot(ADMIN).value;
    }

    function updateAdmin(address _admin) external onlyRole(DEFAULT_ADMIN_ROLE) {
        SubstakeLib.zeroAddressCheck(_admin);
        address oldAdmin = getAdmin();
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _setAdmin(_admin);
        _revokeRole(DEFAULT_ADMIN_ROLE, oldAdmin);
    }

    function _setContract(bytes32 key, address val) internal {
        SubstakeLib.zeroAddressCheck(val);
        if (contractsMap[key] == val) {
            revert IdenticalValue();
        }
        contractsMap[key] = val;
    }

    function _setAddress(bytes32 key, address val) internal {
        SubstakeLib.zeroAddressCheck(val);
        if (addressMap[key] == payable(val)) {
            revert IdenticalValue();
        }
        contractsMap[key] = val;
    }

    function _setUint(bytes32 key, uint256 val) internal {
        SubstakeLib.zeroCheck(val);
        if (uint256Map[key] == val) {
            revert IdenticalValue();
        }
        uint256Map[key] = val;
    }
}
