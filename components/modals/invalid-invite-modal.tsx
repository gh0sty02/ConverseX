"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Link } from "lucide-react";

import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const InvalidInviteModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onCloseHandler = () => router.push("/");

  return (
    <Dialog defaultOpen onOpenChange={onCloseHandler}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6 flex items-center">
          <div className="h-16 w-16 mb-4 bg-black/20 rounded-full flex items-center justify-center">
            <Link className="text-gray-900" size={38} />
          </div>
          <DialogTitle className="flex justify-center ">
            The Invite Link is Invalid or Expired.
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-center">
          Try Using a Different link to join this server
        </DialogDescription>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <Button
            variant="primary"
            className="text-white w-full focus-visible:ring-0"
            onClick={onCloseHandler}
          >
            Got It
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
