// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import { AddUserUntakesType } from "@/interfaces/UserStakes";
import prismadb from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { unstakeBatchId } = req.body;

  if (!unstakeBatchId)
    return res.status(404).json({ message: "unstakeBatchId is required" });

  const users = await prismadb.userUnstakingDetails.findMany({
    where: {
      UnstakeBatchId: unstakeBatchId,
    },
  });

  if (!users)
    return res
      .status(404)
      .json({ message: "No users found with this unstakeBatchId" });

  return res.status(200).json({ users });
}
