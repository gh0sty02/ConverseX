import { getCurrentUser } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH = 15;

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");
    if (!currentUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!conversationId) {
      return new NextResponse("conversationId ID Missing", { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
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
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
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
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
