import { Hash, Menu } from "lucide-react";
import React from "react";
import { MobileToggle } from "@/components/mobile-toggle";
import { UserAvatar } from "../user-avatar";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export const ChatHeader = ({
  name,
  serverId,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div className="font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="h-5 w-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}
      {type === "conversation" && (
        <UserAvatar src={imageUrl} classname="h-8 w-8 md:h-8 md:w-8 mr-2" />
      )}
      <p className="font-semibold text-black dark:text-white">{name}</p>
    </div>
  );
};
