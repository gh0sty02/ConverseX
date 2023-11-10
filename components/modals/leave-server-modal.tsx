"use client";

import axios from "axios";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export const LeaveServerModal = () => {
  const {
    isOpen,
    onClose,
    type,
    data: { server },
  } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isModalOpen = isOpen && type === "leaveServer";

  const leaveServerHandler = async () => {
    try {
      setIsLoading(true);

      await axios.patch(`/api/servers/${server?.id}/leave`);
      onClose();
      router.refresh();
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Leave Server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you Sure you want to leave{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name} ?
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={onClose}
              variant="ghost"
              className="text-xs text-gray-500 w-24"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="text-xs w-24"
              onClick={leaveServerHandler}
              disabled={isLoading}
            >
              Leave
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
