import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";
const { ethers } = require("ethers");
require('dotenv').config();

const main =  () => {
    intilizeUserForPush();
}

const intilizeUserForPush = async () => {
    const jsonProvider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_ETH_SEPOLIA!
    ); 
  
    const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PV!, jsonProvider);
    const userSubstake = await PushAPI.initialize(signer, { env: CONSTANTS.ENV.STAGING });
    console.log("user : ",await userSubstake.channel.info());
}