// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.19;

import "./interfaces/ISubstakeL1Config.sol";
import "./interfaces/IwstETH.sol";
import "../libs/SubstakeLib.sol";

/*
    Testnet Contract Addresses :
        ETHx ERC20 upgradable contract = 0x3338eCd3ab3d3503c55c931d759fA6d78d287236
        wstETH contract = 0x6320cD32aA674d2898A68ec82e869385Fc5f7E2f | not upgradeable
        wETH contract = 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6
        Uniswap wstETH/WETH contract = 0x1c009F9C3386E96e6d4cf5971b1f8cc57a5e9515
*/

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

contract SubstakeL1Config is IL1Config {
    address admin;
    bytes32 public constant CONTRACTS_MAP = keccak256("CONTRACTS_MAP");
    bytes32 public constant UINT_MAP = keccak256("UINT_MAP");
    bytes32 public constant LIDO_WSTETH_TOKEN = keccak256("LIDO_WSTETH_TOKEN");
    bytes32 public constant UNISWAP_WSTETH_WETH_POOL = keccak256("UNISWAP_WSTETH_WETH_POOL");
    bytes32 public constant WETH_CONTRACT = keccak256("WETH_CONTRACT");
    bytes32 public constant UINIWAP_SWAP_DEADLINE = keccak256("UINIWAP_SWAP_DEADLINE");
    bytes32 public constant UNISWAP_SWAP_ROUTER = keccak256("UNISWAP_SWAP_ROUTER");
    bytes32 public constant UNISWAP_POOL_FEE = keccak256("UNISWAP_POOL_FEE");
    // bytes32 public constant HYPERLANE_FEE = keccak256("HYPERLANE_FEE");
    bytes32 public constant SUBSTAKE_VAULT = keccak256("SUBSTAKE_VAULT");
    // bytes32 public constant HYPERLANE_MAILBOX_L1 = keccak256("HYPERLANE_MAILBOX_L1");
    // bytes32 public constant HYPERLANE_MAILBOX_L2 = keccak256("HYPERLANE_MAILBOX_L2");

    constructor(address _admin) {
        admin = _admin;
        setContract(LIDO_WSTETH_TOKEN, 0x6320cD32aA674d2898A68ec82e869385Fc5f7E2f);
        setContract(LIDO_WSTETH_TOKEN, 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0);
        setContract(UNISWAP_WSTETH_WETH_POOL, 0x109830a1AAaD605BbF02a9dFA7B0B92EC2FB7dAa);
        setContract(WETH_CONTRACT, 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);
        setContract(UNISWAP_SWAP_ROUTER, 0xE592427A0AEce92De3Edee1F18E0157C05861564);
        setContract(SUBSTAKE_VAULT, 0xE592427A0AEce92De3Edee1F18E0157C05861564); //dummy
        // setContract(HYPERLANE_MAILBOX_L1, 0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766);
        // setContract(HYPERLANE_MAILBOX_L2, 0x3C5154a193D6e2955650f9305c8d80c18C814A68);
        setUint(UNISWAP_POOL_FEE, 3000); // 0.3%
        setUint(UINIWAP_SWAP_DEADLINE, 43200); // 12 hr
        // setUint(HYPERLANE_FEE, 1900000000000000);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    function updateLidoWstEthToken(address _newAddress) external override onlyAdmin {
        setContract(LIDO_WSTETH_TOKEN, _newAddress);
    }

    function updateUniswap_wstETH_wETH_pool(address _newAddress) external override onlyAdmin {
        setContract(UNISWAP_WSTETH_WETH_POOL, _newAddress);
    }

    function updateWeth(address _newAddress) external override onlyAdmin {
        setContract(WETH_CONTRACT, _newAddress);
    }

    function updateUniswapSwapRouter(address _newAddress) external override onlyAdmin {
        setContract(UNISWAP_SWAP_ROUTER, _newAddress);
    }

    function updateSubstakeVault(address _newAddress) external override onlyAdmin {
        setContract(SUBSTAKE_VAULT, _newAddress);
    }

    function updateUniswapSwapDeadline(uint256 _newDeadline) external override onlyAdmin {
        setUint(UINIWAP_SWAP_DEADLINE, _newDeadline);
    }

    function updateUniswapPoolFee(uint256 _newPoolFee) external override onlyAdmin {
        setUint(UNISWAP_POOL_FEE, _newPoolFee);
    }

    // function updateHyperlaneFees(uint256 _newFees) external override onlyAdmin {
    //     setUint(HYPERLANE_FEE, _newFees);
    // }

    // function updateHyperlanceMailBoxL1(address _newAddress) external override onlyAdmin {
    //     setContract(HYPERLANE_MAILBOX_L1, _newAddress);
    // }

    // function updateHyperlanceMailBoxL2(address _newAddress) external override onlyAdmin {
    //     setContract(HYPERLANE_MAILBOX_L2, _newAddress);
    // }

    function getUniswap_wstETH_wETH_pool() external view override returns (address) {
        return contractsMap()[UNISWAP_WSTETH_WETH_POOL];
    }

    function getUniswapSwapRouter() external view override returns (address) {
        return contractsMap()[UNISWAP_SWAP_ROUTER];
    }

    function getSubstakeVault() external view override returns (address) {
        return contractsMap()[SUBSTAKE_VAULT];
    }

    function getUniswapSwapDeadline() external view override returns (uint256) {
        return uintsMap()[UINIWAP_SWAP_DEADLINE];
    }

    // function getHyperlaneFee() external view override returns (uint256) {
    //     return uintsMap()[HYPERLANE_FEE];
    // }

    function getUniswapPoolFee() external view override returns (uint256) {
        return SubstakeLib.getUint256Slot(UNISWAP_POOL_FEE).value;
    }

    function getLidoWstETHToken() public view returns (address) {
        return contractsMap()[LIDO_WSTETH_TOKEN];
    }

    function getWeth() public view returns (address) {
        return contractsMap()[WETH_CONTRACT];
    }

    function getL1ManagerWstETHBalance(address _address) external override returns (uint256) {
        return (IwstETH(getLidoWstETHToken()).balanceOf(_address));
    }

    // function hyperlaneMailboxL1() external view override returns (address) {
    //     return contractsMap()[HYPERLANE_MAILBOX_L1];
    // }

    // function hyperlaneMailboxL2() external view override returns (address) {
    //     return contractsMap()[HYPERLANE_MAILBOX_L2];
    // }

    function contractsMap() internal pure returns (mapping(bytes32 => address) storage) {
        return SubstakeLib.bytes32ToAddressMapping(CONTRACTS_MAP);
    }

    function uintsMap() internal pure returns (mapping(bytes32 => uint256) storage) {
        return SubstakeLib.bytes32ToUintMapping(UINT_MAP);
    }

    function setContract(bytes32 key, address val) internal {
        SubstakeLib.zeroAddressCheck(val);
        if (contractsMap()[key] == val) {
            revert IdenticalValue();
        }
        contractsMap()[key] = val;
    }

    function setUint(bytes32 key, uint256 val) internal {
        SubstakeLib.zeroCheck(val);
        if (uintsMap()[key] == val) {
            revert IdenticalValue();
        }
        uintsMap()[key] = val;
    }
}
