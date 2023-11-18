import { getCurrentUserPages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRoles } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "message not allowed" });
  }

  try {
    const currentUser = await getCurrentUserPages(req);
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!currentUser) {
      console.log("MESSAGE ID PATCH: no current user");
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(401).json({ error: "Server Id Required" });
    }
    if (!channelId) {
      return res.status(401).json({ error: "Channel Id Required" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: {
          some: {
            profileId: currentUser.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ error: "Server Not Found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ error: "Channel Not Found" });
    }

    const member = server.members.find(
      (member) => member.profileId === currentUser.id
    );

    if (!member) {
      return res.status(404).json({ error: "Member Not Found" });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },

      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message Not Found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRoles.ADMIN;
    const isModerator = member.role === MemberRoles.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      console.log("MESSAGE ID PATCH: no permission");
      return res.status(401).json({ error: "unauthorized" });
    }

    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        console.log("MESSAGE ID PATCH: not the owner");
        return res.status(401).json({ error: "unauthorized" });
      }
      message = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content: content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID_PATCH]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
