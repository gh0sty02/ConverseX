"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import { FileUpload } from "@/components/file-upload";
import { createServerSchema } from "@/lib/validation/serverSchema";
import { useModalSubmitFactory } from "@/hooks/factory/useModalSubmitFactory";
import { useCreateServerForm } from "@/lib/form/useServerForm";

export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const form = useCreateServerForm();

  // to avoid hydration errors for modal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const submitHandler = useModalSubmitFactory({
    form,
    method: "POST",
    url: "/api/servers",
    schema: createServerSchema,
    refresh: true,
  });

  const isLoading = form.formState.isSubmitting;

  if (!isMounted) {
    return null;
  }
  return (
    <Dialog open>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Welcome to ConverseX
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            To kick things off, let&apos;s create your very own server.
            <br />
            Personalize it with a name and image
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-8"
          >
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                          isImageLoading={isImageLoading}
                          setIsImageLoading={setIsImageLoading}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-50 dark:text-secondary/70">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter Server Name"
                        {...field}
                      />
                    </FormControl>
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
