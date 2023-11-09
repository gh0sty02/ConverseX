import { MemberRoles } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const profile = await getCurrentUser();
    const { name, type } = await req.json();

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 401 });
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
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNELS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
