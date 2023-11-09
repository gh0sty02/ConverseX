import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const getCurrentUser = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findFirst({
    where: {
      userId,
    },
  });

  return profile;
};
