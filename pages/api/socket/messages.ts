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
    const user = await getCurrentUserPages(req);

    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!user) {
      return res.status(401).json({ error: "unauthorized" });
    }
    if (!serverId) {
      return res.status(401).json({ error: "Server ID Missing" });
    }
    if (!channelId) {
      return res.status(401).json({ error: "Server ID Missing" });
    }

    if (!content) {
      return res.status(401).json({ error: "Content Missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        members: { some: { profileId: user.id } },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({
        message: "Server Not Found",
      });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) {
      return res.status(404).json({
        message: "Channel Not Found",
      });
    }

    const member = server.members.find(
      (member) => member.profileId === user.id
    );

    if (!member) {
      return res.status(404).json({
        message: "Member Not Found",
      });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
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

    const channelKey = `chat:${channelId}:messages`;

    console.log(channelKey);

    res?.socket?.server?.io?.emit(channelKey, member);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);

    return res.status(500).json({ error: "Something went wrong" });
  }
}
