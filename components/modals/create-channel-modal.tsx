"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import qs from "query-string";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createChannelSchema } from "@/lib/validation/channelSchema";
import { useModal } from "@/hooks/useModalStore";
import { useModalSubmitFactory } from "@/hooks/factory/useModalSubmitFactory";
import { useCreateChannelForm } from "@/lib/form/useChannelForm";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "../ui/select";
import { ChannelType } from "@prisma/client";

export const CreateChannelModal = () => {
  // hook calls
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { isOpen, onClose, onOpen, type } = useModal();
  const router = useRouter();
  const params = useParams();
  const form = useCreateChannelForm();

  const url = qs.stringifyUrl({
    url: "/api/channels",
    query: {
      serverId: params?.serverId,
    },
  });

  const submitHandler = useModalSubmitFactory({
    form,
    method: "POST",
    url,
    schema: createChannelSchema,
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const isModalOpen = isOpen && type === "createChannel";
  const isLoading = form.formState.isSubmitting;
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Channel
          </DialogTitle>
          {/* <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and a image. You can
            always change it later
          </DialogDescription> */}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-8"
          >
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-50 dark:text-secondary/70">
                      Channel Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter Channel Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
