import { MemberRoles } from "@prisma/client";
import { NextResponse } from "next/server";
import * as z from "zod";

import { getCurrentUser } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { createChannelSchema } from "@/lib/validation/channelSchema";
import { serverErrorHandler } from "@/lib/server-error-handler";

// @desc    Delete Channel
// @route   POST /api/channels/channelId?server=serverId
// @access  ADMIN | MODERATOR
export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await getCurrentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRoles.ADMIN, MemberRoles.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNELS_ID_DELETE]", error);
    return serverErrorHandler(error);
  }
}
// @desc    Edit Channel
// @route   PATCH /api/channels/channelId?server=serverId
// @access  ADMIN | MODERATOR
export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const { name, type } = createChannelSchema.parse(await req.json());
    const profile = await getCurrentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID Missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name Cannot be 'general'", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRoles.ADMIN, MemberRoles.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              NOT: {
                name: "general",
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNELS_ID_PATCH]", error);
    return serverErrorHandler(error);
  }
}
