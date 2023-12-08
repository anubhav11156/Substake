// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    address,
    assetsExpected,
    assetsFinalized,
    unstakeBatchId,
    protocol,
    network,
  } = req.body;

  if (!address) return res.status(404).json({ message: "address is required" });
  if (!assetsExpected)
    return res.status(404).json({ message: "assetsExpected is required" });
  if (!assetsFinalized)
    return res.status(404).json({ message: "assetsFinalized is required" });
  if (!unstakeBatchId)
    return res.status(404).json({ message: "unstakeBatchId is required" });
  if (!protocol)
    return res.status(404).json({ message: "protocol is required" });
  if (!network) return res.status(404).json({ message: "network is required" });

  const user = await prismadb.userUnstakingDetails.create({
    data: {
      address,
      ExpectedAsset: assetsExpected,
      FinalizedAsset: assetsFinalized,
      UnstakeBatchId: unstakeBatchId,
      status: "processing",
      protocol,
      network,
    },
  });

  if (user)
    return res
      .status(200)
      .json({ message: "user unstakes stored successfully", user });

  return res.status(500).json({ message: "Something went wrong!" });
}
