import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
const { ethers, JsonRpcProvider } = require("ethers");
require('dotenv').config();

const ethSepoliaRpc = process.env.ETH_SEPOLIA;
const privateKey = process.env.PV_KEY;

const provider = new JsonRpcProvider(ethSepoliaRpc);
const signer = new ethers.Wallet(privateKey, provider);

console.log("signer : ",signer);