"use client";

import { Check, Copy, RefreshCw } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origin";

export const InviteModal = () => {
  const {
    isOpen,
    onClose,
    onOpen,
    type,
    data: { server },
  } = useModal();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userId } = useAuth();

  const copyLinkHandler = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const createNewLinkHandler = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const origin = useOrigin();

  const isModalOpen = isOpen && type === "invite";
  const inviteUrl = `${origin}/invite/${server?.inviteCode}?inviter=${userId}`;

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Server Invite Link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteUrl}
              disabled={isLoading}
              readOnly
            />
            <Button size="icon" onClick={copyLinkHandler} disabled={isLoading}>
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
          <Button
            className="text-xs text-zinc-500 mt-4"
            variant="link"
            size="sm"
            disabled={isLoading}
            onClick={createNewLinkHandler}
          >
            Generate a new Link
            <RefreshCw className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
