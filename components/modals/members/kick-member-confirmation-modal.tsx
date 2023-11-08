import React, { Dispatch, SetStateAction } from "react";
import { Member, Profile } from "@prisma/client";

import { Button } from "../../ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "../../ui/dialog";

interface KickUserConfirmationModal {
  setIsKickMemberDialogOpen: Dispatch<SetStateAction<boolean>>;
  isKickMemberDialogOpen: boolean;
  onKick: (memberId: string) => void;
  member: Member & { profile: Profile };
}

export const KickUserConfirmationModal = ({
  member,
  isKickMemberDialogOpen,
  onKick,
  setIsKickMemberDialogOpen,
}: KickUserConfirmationModal) => {
  return (
    <Dialog
      open={isKickMemberDialogOpen}
      onOpenChange={setIsKickMemberDialogOpen}
    >
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="text-xl font-semibold text-left">
          Kick {member.profile.name} from Server
        </DialogHeader>
        <DialogDescription className="text-black">
          Are you sure you want to kick @{member.profile.name} from the server ?
          they will be able to rejoin again with new invite.
        </DialogDescription>
        <DialogFooter className="flex items-center justify-end ">
          <Button
            onClick={() => setIsKickMemberDialogOpen(false)}
            variant="link"
            className="text-xs text-gray-500 w-24"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="text-xs w-24"
            onClick={() => {
              setIsKickMemberDialogOpen(false);
              onKick(member.id);
            }}
          >
            Kick
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
