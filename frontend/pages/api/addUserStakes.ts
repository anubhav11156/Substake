// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address, assets, shares, stakeBatchId, protocol, network } = req.body;

  if (!address) return res.status(404).json({ message: "address is required" });
  if (!assets) return res.status(404).json({ message: "assets is required" });
  if (!shares) return res.status(404).json({ message: "shares is required" });
  if (!stakeBatchId)
    return res.status(404).json({ message: "stakeBatchId is required" });
  if (!protocol)
    return res.status(404).json({ message: "protocol is required" });
  if (!network) return res.status(404).json({ message: "network is required" });

  const user = await prismadb.userStakingDetails.create({
    data: {
      address,
      Asset: assets,
      shares,
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
