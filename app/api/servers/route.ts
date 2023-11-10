import { v4 as uuid } from "uuid";
import { MemberRoles } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { createServerSchema } from "@/lib/validation/serverSchema";
import { serverErrorHandler } from "@/lib/server-error-handler";

// @desc    Create New Server
// @route   POST /api/servers
// @access  Public
export async function POST(req: Request) {
  try {
    const { name, imageUrl } = createServerSchema.parse(await req.json());

    const profile = await getCurrentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        imageUrl,
        name,
        inviteCode: uuid(),
        channels: {
          create: [{ name: "general", profileId: profile.id }],
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRoles.ADMIN }],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);
    return serverErrorHandler(error);
  }
}
