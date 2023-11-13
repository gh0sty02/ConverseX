import { getCurrentUser } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import React from "react";

interface ServerIdPageProps {
  params: {
    serverId: string;
  };
}

export default async function MemberIdPage({
  params: { serverId },
}: ServerIdPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: user.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.channels[0];

  console.log(initialChannel);

  if (initialChannel?.name !== "general") {
    console.log("return");
    return null;
  }

  console.log("yes");

  return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`);
}
