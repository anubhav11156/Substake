// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address } = req.body;

  if (!address) return res.status(404).json({ message: "address is required" });

  const user = await prismadb.userStakingDetails.findMany({
    where: {
      address,
    },
  });

  if (!user)
    res.status(404).json({ message: "user not found with this address" });

  if (user) return res.status(200).json({ user: user });
}
