"use client";

import { useEffect, useState } from "react";
import { Member, Server } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface ConfirmJoinServerModalProps {
  server: Server & {
    members: Member[];
  };
  inviter: string;
  currentUserId: string;
}

export const ConfirmJoinServerModal = ({
  server,
  inviter,
  currentUserId,
}: ConfirmJoinServerModalProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const addMemberToServerHandler = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/servers/${server.id}/add-member`, {
        memberId: currentUserId,
        inviteCode: server.inviteCode,
      });

      router.refresh();
      router.push(`/servers/${server.id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="flex justify-center ">
            <Avatar className="h-16 w-16">
              <AvatarImage src={server.imageUrl} />
            </Avatar>
          </DialogTitle>
          <div className="text-center text-zinc-500">
            {inviter} has Invited you to Join <br />
            <div className="font-bold text-xl text-black">{server.name}</div>
            <div className="text-xs">{server.members.length} Members</div>
          </div>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <Button
            variant="primary"
            className="text-white w-full focus-visible:ring-0"
            onClick={addMemberToServerHandler}
            disabled={isLoading}
          >
            Accept Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
