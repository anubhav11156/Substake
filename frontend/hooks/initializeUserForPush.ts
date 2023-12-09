import { CONSTANTS, PushAPI } from "@pushprotocol/restapi";
import { ethers } from "ethers";

import { fetchStakesByBatchId } from "../actions/getStakesByBatchId";
import { fetchUnstakesByBatchId } from "../actions/getUnstakesByBatchId";

export const intilizeUserForPush = async (
  stakeBatchId?: number,
  unstakeBatchId?: number
) => {
  if (!stakeBatchId && !unstakeBatchId) return;
  let res;

  if (stakeBatchId) {
    res = await fetchStakesByBatchId(stakeBatchId);
  }

  if (unstakeBatchId) {
    res = await fetchUnstakesByBatchId(unstakeBatchId);
  }

  console.log("res : ", res);

  const jsonProvider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_ETH_SEPOLIA!
  );

  const signer = new ethers.Wallet(process.env.NEXT_PUBLIC_PV!, jsonProvider);
  const userSubstake = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.STAGING,
  });

  console.log("user : ", await userSubstake.channel.info());
};
