// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { stakeBatchId } = req.body;

  if (!stakeBatchId)
    return res.status(404).json({ message: "stakeBatchId is required" });

  const users = await prismadb.userStakingDetails.findMany({
    where: {
      StakeBatchId: stakeBatchId,
    },
  });

  if (!users)
    return res
      .status(404)
      .json({ message: "No users found with this stakeBatchId" });

  return res.status(200).json({ users });
}
