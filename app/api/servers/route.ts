import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { v4 as uuid } from "uuid";
import { NextResponse } from "next/server";
import { MemberRoles } from "@prisma/client";
import * as z from "zod";
import { formatErrorMessages } from "@/lib/zod-error-parser";

const serverPostSchema = z.object({
  name: z.string().min(1, {
    message: "Server Name is Required",
  }),
  imageUrl: z.string().min(1, {
    message: "Image Url is Required",
  }),
});

export async function POST(req: Request) {
  try {
    const res = serverPostSchema.parse(await req.json());

    const { name, imageUrl } = res;

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

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST]", error);

    if (error instanceof z.ZodError) {
      return new NextResponse(
        `Validation Error : ${formatErrorMessages(error)}`,
        {
          status: 500,
        }
      );
    }

    return new NextResponse("Internal Error", { status: 500 });
  }
}
