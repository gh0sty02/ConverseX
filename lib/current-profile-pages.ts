import { getAuth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { NextApiRequest } from "next";

export const getCurrentUserPages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findFirst({
    where: {
      userId,
    },
  });

  // if last name is not available, it is set to 'null' as default, so remove it
  if (profile?.name.split(" ")[1] === "null") {
    return await db.profile.update({
      where: {
        userId,
      },
      data: {
        name: profile?.name
          .split(" ")
          .filter((chunk) => chunk !== "null")
          .join(" "),
      },
    });
  }
  return profile;
};
