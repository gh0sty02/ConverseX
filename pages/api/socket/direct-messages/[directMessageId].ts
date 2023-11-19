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
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!currentUser) {
      console.log("MESSAGE ID PATCH: no current user");
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!directMessageId) {
      return res.status(401).json({ error: "Direct Message Id Missing" });
    }
    if (!conversationId) {
      return res.status(401).json({ error: "Conversation Id Missing" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: currentUser.id,
            },
          },
          {
            memberTwo: {
              profileId: currentUser.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(401).json({ error: "No conversation found" });
    }

    // find out who exactly is the receiver
    const member =
      conversation.memberOne.profileId === currentUser.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({
        message: "Member Not Found",
      });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },

      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message Not Found" });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRoles.ADMIN;
    const isModerator = member.role === MemberRoles.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      console.log("MESSAGE ID PATCH: no permission");
      return res.status(401).json({ error: "unauthorized" });
    }

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
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
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
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

    const updateKey = `chat:${conversationId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("[MESSAGE_ID_PATCH]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
