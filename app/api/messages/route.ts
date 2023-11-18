import { getCurrentUser } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!channelId) {
      return new NextResponse("Channel ID Missing", { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
    }

    // This variable stores the message ID of the last message fetched from the database.
    // It is sent back in the response, serving as a reference point to fetch messages after this ID.

    let nextCursor = null;

    // If the length of the messages array is equal to the specified batch size (MESSAGES_BATCH),
    // it indicates that there may be more messages in the database that can be fetched.
    // In this case, the ID of the last message in the current batch is stored in nextCursor.
    // This ID can be used as a reference to fetch later messages in subsequent requests.
    // If the length of messages is not equal to MESSAGES_BATCH, it means there are no more
    // messages beyond the current batch, and nextCursor remains null.

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
