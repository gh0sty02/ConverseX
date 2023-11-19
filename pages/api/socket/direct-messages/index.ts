import { getCurrentUserPages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const currentUser = await getCurrentUserPages(req);

    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!currentUser) {
      return res.status(401).json({ error: "unauthorized" });
    }
    if (!conversationId) {
      return res.status(401).json({ error: "conversationId Missing" });
    }

    if (!content) {
      return res.status(401).json({ error: "Content Missing" });
    }

    // find the conversation where the id matches or where current user is either a sender or receiver
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          { memberOne: { profileId: currentUser.id } },
          { memberTwo: { profileId: currentUser.id } },
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

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);

    return res.status(500).json({ error: "Something went wrong" });
  }
}
