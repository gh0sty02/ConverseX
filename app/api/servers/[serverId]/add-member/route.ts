import { getCurrentUser } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { serverErrorHandler } from "@/lib/server-error-handler";
import { addMemberToServerSchema } from "@/lib/validation/inviteMemberSchema";
import { NextResponse } from "next/server";

// @desc    Add Member to the server
// @route   PATCH /api/servers/serverId/add-member
// @access  Server Members
export async function PATCH(
  req: Request,
  { params: { serverId } }: { params: { serverId: string } }
) {
  try {
    const { inviteCode, memberId } = addMemberToServerSchema.parse(
      await req.json()
    );

    const profile = await getCurrentUser();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        inviteCode: inviteCode,
      },
      include: {
        members: true,
      },
      data: {
        members: {
          create: [
            {
              profileId: memberId,
            },
          ],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_ADD_MEMBER]", error);
    return serverErrorHandler(error);
  }
}
