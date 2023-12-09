// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { AddUserStakesType } from "@/interfaces/UserStakes";
import prismadb from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    address,
    assets,
    stakeBatchId,
    protocol,
    network,
  }: AddUserStakesType = req.body;

  if (!address) return res.status(404).json({ message: "address is required" });
  if (!assets) return res.status(404).json({ message: "assets is required" });
  if (!stakeBatchId)
    return res.status(404).json({ message: "stakeBatchId is required" });
  if (!protocol)
    return res.status(404).json({ message: "protocol is required" });
  if (!network) return res.status(404).json({ message: "network is required" });

  console.log(assets, stakeBatchId, network);

  const user = await prismadb.userStakingDetails.create({
    data: {
      address,
      Asset: assets,
      StakeBatchId: stakeBatchId,
      status: "processing",
      protocol,
      network,
    },
  });

  if (user)
    return res
      .status(200)
      .json({ message: "user stakes stored successfully", user });

  return res.status(500).json({ message: "Something went wrong!" });
}
