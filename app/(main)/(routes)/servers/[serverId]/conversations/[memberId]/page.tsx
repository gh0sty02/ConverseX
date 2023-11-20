import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { getCurrentUser } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ConverseX | Conversation",
  description: "Conversation with Users",
};

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

export default async function MemberIdPage({
  params: { memberId, serverId },
  searchParams: { video },
}: MemberIdPageProps) {
  // current user
  const loggedInUser = await getCurrentUser();

  if (!loggedInUser) {
    return redirectToSignIn();
  }

  // get the profile of logged in user
  const currentUser = await db.member.findFirst({
    where: {
      serverId,
      profileId: loggedInUser.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentUser) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(currentUser.id, memberId);

  if (!conversation) {
    return redirect(`/servers/${serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  // check who exactly is at the receivers end by checking the current user's id with member one's id as getOrCreateConversation() returns the conversation initiator as member One
  const receivingMember =
    memberOne.id === currentUser.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={receivingMember.profile.imageUrl}
        name={receivingMember.profile.name}
        serverId={serverId}
        type="conversation"
      />
      {video && <MediaRoom chatId={conversation.id} video audio />}
      {!video && (
        <>
          <ChatMessages
            member={currentUser}
            name={receivingMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={receivingMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
}
