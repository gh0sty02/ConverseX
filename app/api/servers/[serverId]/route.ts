import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { createServerSchema } from "@/lib/validation/serverSchema";
import { serverErrorHandler } from "@/lib/server-error-handler";

// @desc    Update Server
// @route   PATCH /api/servers/serverId
// @access  ADMIN | MODERATOR
export const PATCH = async (
  req: Request,
  { params: { serverId } }: { params: { serverId: string } }
) => {
  try {
    const { imageUrl, name } = createServerSchema.parse(await req.json());

    const profile = await getCurrentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID is Required", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    console.log(server);

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH", error);

    return serverErrorHandler(error);
  }
};

// @desc    Delete Server
// @route   DELETE /api/servers/serverId
// @access  ADMIN | MODERATOR
export const DELETE = async (
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

    const server = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_LEAVE_PATCH", error);

    return serverErrorHandler(error);
  }
};
