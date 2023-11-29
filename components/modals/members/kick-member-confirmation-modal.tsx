import React, { Dispatch, SetStateAction, useState } from "react";
import { Member, Profile, Server } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { useRouter } from "next/navigation";
import axios, { AxiosResponse } from "axios";
import { Loader2 } from "lucide-react";
import { createUrl } from "@/lib/utils";

interface KickUserConfirmationModal {
  setIsKickMemberDialogOpen: Dispatch<SetStateAction<boolean>>;
  isKickMemberDialogOpen: boolean;
  onKick: (memberId: string) => void;
  member: Member & { profile: Profile };
}

export const KickUserConfirmationModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    isOpen,
    onClose,
    onOpen,
    type,
    data: { memberId, memberName, server },
  } = useModal();
  const router = useRouter();

  const onKickHandler = async () => {
    try {
      setIsLoading(true);

      const url = createUrl(`/api/members/${memberId}`, {
        serverId: server?.id,
      });

      const response: AxiosResponse<Server> = await axios.delete(url);

      router.refresh();

      onOpen("members", { server: response.data });
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isModalOpen = isOpen && type === "confirmKickMember";
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="text-xl font-semibold text-left">
          Kick {memberName} from Server
        </DialogHeader>
        <DialogDescription className="text-black">
          Are you sure you want to kick @{memberName} from the server ? they
          will be able to rejoin again with new invite.
        </DialogDescription>
        <DialogFooter className="flex items-center justify-end ">
          <Button
            onClick={() => onClose()}
            variant="ghost"
            className="text-xs text-gray-500 w-24"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="text-xs w-24 text-center"
            onClick={() => {
              onKickHandler();
            }}
          >
            {isLoading ? (
              <Loader2 className="animate-spin text-zinc-500 w-4 h-4" />
            ) : (
              "Kick"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
