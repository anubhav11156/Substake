#!/bin/bash

# Set environment variables
ANVIL=http://localhost:8545
PRIVATE_KEY_ANV=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 

# Run the forge script
forge script script/SubstakeL1Config.s.sol:SubstakeL1ConfigScript --rpc-url $ANVIL --private-key $PRIVATE_KEY_ANV --broadcast
