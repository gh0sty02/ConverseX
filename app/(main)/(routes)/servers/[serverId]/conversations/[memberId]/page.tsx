import { ChatHeader } from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { getCurrentUser } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

export default async function MemberIdPage({
  params: { memberId, serverId },
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
    </div>
  );
}
