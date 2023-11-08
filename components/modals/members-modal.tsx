"use client";

import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import qs from "query-string";
import { MemberRoles, Server } from "@prisma/client";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import { useModal } from "@/hooks/useModalStore";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import { KickUserConfirmationModal } from "@/components/modals/members/kick-member-confirmation-modal";

const roleIconMap = {
  ADMIN: <ShieldAlert className="h-4 w-4 text-red-500" />,
  MODERATOR: <ShieldCheck className="h-4 w-4 text-indigo-500 ml-2" />,
  GUEST: null,
};

export const MembersModal = () => {
  const { isOpen, onClose, onOpen, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");
  const [isKickMemberDialogOpen, setIsKickMemberDialogOpen] = useState(false);
  const router = useRouter();

  const { server } = data as { server: ServerWithMembersWithProfiles };
  const isModalOpen = isOpen && type === "members";

  const onRoleChange = async (
    memberId: string,
    role: MemberRoles,
    currentRole: MemberRoles
  ) => {
    try {
      if (role === currentRole) {
        return;
      }

      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response: AxiosResponse<Server> = await axios.patch(url, { role });

      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);

      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response: AxiosResponse<Server> = await axios.delete(url);

      router.refresh();

      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="h-4 w-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent
                              sideOffset={10}
                              // onClick={() => onRoleChange(member.id, )}
                            >
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, "GUEST", member.role)
                                }
                              >
                                <Shield className="h-4 w-4 mr-2" /> Guest{" "}
                                {member.role === "GUEST" && (
                                  <Check className="h-4 w-4 ml-auto " />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(
                                    member.id,
                                    "MODERATOR",
                                    member.role
                                  )
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />{" "}
                                Moderator{" "}
                                {member.role === "MODERATOR" && (
                                  <Check className="h-4 w-4 ml-auto " />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setIsKickMemberDialogOpen(true);
                          }}
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                      <KickUserConfirmationModal
                        isKickMemberDialogOpen={isKickMemberDialogOpen}
                        member={member}
                        onKick={onKick}
                        setIsKickMemberDialogOpen={setIsKickMemberDialogOpen}
                        key={member.id}
                      />
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-zinc-500 w-4 h-4 ml-auto" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
