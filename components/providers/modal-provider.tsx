"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { CreateServerModal } from "@/components/modals/server/create-server-modal";
import { InviteModal } from "@/components/modals/server/invite-modal";
import { EditServerModal } from "@/components/modals/server/edit-server-modal";
import { MembersModal } from "@/components/modals/member/members-modal";
import { CreateChannelModal } from "@/components/modals/channel/create-channel-modal";
import { LeaveServerModal } from "@/components/modals/server/leave-server-modal";
import { DeleteServerModal } from "@/components/modals/server/delete-server-modal";
import { DeleteChannelModal } from "@/components/modals/channel/delete-channel-modal";
import { EditChannelModal } from "@/components/modals/channel/edit-channel-modal";
import { MessageFileModal } from "@/components/modals/message/message-file-modal";
import { DeleteMessageModal } from "@/components/modals/message/delete-message-modal";
import { KickUserConfirmationModal } from "@/components/modals/member/kick-member-confirmation-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
      <KickUserConfirmationModal />
    </>
  );
};
