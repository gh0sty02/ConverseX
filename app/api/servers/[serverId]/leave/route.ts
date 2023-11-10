import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { serverErrorHandler } from "@/lib/server-error-handler";

// @desc    Leave Server
// @route   PATCH /api/servers/serverId/leave
// @access  Server Members
export const PATCH = async (
  req: Request,
  { params: { serverId } }: { params: { serverId: string } }
) => {
  try {
    const profile = await getCurrentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server Id is Required", { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_LEAVE_PATCH", error);

    return serverErrorHandler(error);
  }
};
