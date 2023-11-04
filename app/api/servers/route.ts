import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { v4 as uuid } from "uuid";
import { NextResponse } from "next/server";
import { MemberRoles } from "@prisma/client";
import * as z from "zod";

const serverPostSchema = z.object({
  name: z.string(),
  imageUrl: z.string().min(1, {
    message: "Image Url is Required",
  }),
});

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();

    const profile = await currentProfile();

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

    console.log(server);

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);

    return new NextResponse("Internal Error", { status: 500 });
  }
}
