import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/current-profile";
import { db } from "@/lib/db";
import * as z from "zod";
import { MemberRoles } from "@prisma/client";
import { serverErrorHandler } from "@/lib/server-error-handler";

const memberRoleSchema = z.object({
  role: z.nativeEnum(MemberRoles, {
    required_error: "Member Role is Required",
  }),
});

// @desc    Change Role of Server Member
// @route   PATCH /api/members/memberId/
// @access  ADMIN | MODERATOR
export async function PATCH(
  req: Request,
  { params: { memberId } }: { params: { memberId: string } }
) {
  try {
    const { role } = memberRoleSchema.parse(await req.json());

    const profile = await getCurrentUser();

    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("UnAuthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    if (!memberId) {
      return new NextResponse("Member ID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          update: {
            where: {
              id: memberId,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBER_ID_PATCH]", error);

    return serverErrorHandler(error);
  }
}

// @desc    Kick Server Member
// @route   DELETE /api/members/memberId/
// @access  ADMIN | MODERATOR
export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await getCurrentUser();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id,
            },
          },
        },
      },
      include: {
        members: {
          include: {
            profile: true,
          },
          orderBy: {
            role: "asc",
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBER_ID_DELETE]", error);
    return serverErrorHandler(error);
  }
}
