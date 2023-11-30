// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

interface ISubstakeL2Config {
    struct ExchangeRate {
        uint256 totalETH;
        uint256 totalSubToken;
        uint256 lidoExRate;
        uint256 ethInTransit;
    }

    error IdenticalValue();

    function updateTotalETH(uint256) external;
    function updateTotalSubToken(uint256) external;
    function updateLidoExRate(uint256) external;
    function updateEthInTransit(uint256) external;
    function updateSubstakeVault(address) external;
    function updateScrollL2ETHGateway(address) external;
    function updateSubstakeL1Manager(address) external;
    function updateStakingFee(uint256) external;
    function updateUnstakingFee(uint256) external;
    function updateStakeThreshold(uint256) external;
    function updateUnstakeThreshold(uint256) external;
    function updateStakeBatchMaxWaitTime(uint256) external;
    function updateUnstakeBatchMaxWaitTime(uint256) external;
    function updateMinStakersInBatch(uint256) external;
    function updateMinUnstakersInBatch(uint256) external;
    function updateAdmin(address) external;
    function updateFeeCollector(address) external;

    function getExchangeRate() external view returns (ExchangeRate memory);
    function getSubstakeVault() external view returns (address);
    function getScrollL2ETHGateway() external view returns (address);
    function getSubstakeL1Manager() external view returns (address);
    function getStakingFee() external view returns (uint256);
    function getUnstakingFee() external view returns (uint256);
    function getStakeThreshold() external view returns (uint256);
    function getUnstakeThreshold() external view returns (uint256);
    function getStakeBatchMaxWaitTime() external view returns (uint256);
    function getUnstakeBatchMaxWaitTime() external view returns (uint256);
    function getMinStakersInBatch() external view returns (uint256);
    function getMinUnstakersInBatch() external view returns (uint256);
    function getAdmin() external view returns (address);
    function getFeeCollector() external view returns (address payable);

    function computeFees(uint256, uint8) external view returns (uint256);
}
