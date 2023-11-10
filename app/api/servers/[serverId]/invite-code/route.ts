import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

import { getCurrentUser } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { serverErrorHandler } from "@/lib/server-error-handler";

// @desc    Change Server Invite Code
// @route   PATCH /api/servers/serverId/invite-code
// @access  Server Members
export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await getCurrentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuid(),
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID]", error);
    return serverErrorHandler(error);
  }
}
