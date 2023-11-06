import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRoles } from "@prisma/client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  CreateChannelMenuItem,
  DeleteServerMenuItem,
  InvitePeopleMenuItem,
  LeaveServerMenuItem,
  ManageMembersMenuItem,
  ServerSettingsMenuItem,
} from "./server-header-menu-items";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRoles;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const isAdmin = role === MemberRoles.ADMIN;

  const isModerator = isAdmin || role === MemberRoles.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
        {isModerator && <InvitePeopleMenuItem />}
        {isAdmin && <ServerSettingsMenuItem />}
        {isAdmin && <ManageMembersMenuItem />}
        {isModerator && <CreateChannelMenuItem />}
        {isModerator && <DropdownMenuSeparator />}
        {isModerator && <DeleteServerMenuItem />}
        {!isAdmin && <LeaveServerMenuItem />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
