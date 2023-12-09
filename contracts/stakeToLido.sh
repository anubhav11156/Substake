#!/bin/bash

# Set environment variables
ANVIL=http://localhost:8545

 forge test --match-contract SubstakeL1ManagerTest --match-test test_stakeToLido  --fork-url $ANVIL -vvv