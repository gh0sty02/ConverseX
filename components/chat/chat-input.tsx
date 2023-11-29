"use client";

import { useEffect } from "react";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Plus, SendHorizonal as SendHorizontal } from "lucide-react";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/useModalStore";
import { EmojiPicker } from "@/components/emoji-picker";
import { createUrl } from "@/lib/utils";
import { useModalSubmitFactory } from "@/hooks/factory/useModalSubmitFactory";
import { useTextMessageForm } from "@/lib/form/useTextMessageForm";
import { createTextMessageSchema } from "@/lib/validation/textMessageSchema";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

export const ChatInput = ({ apiUrl, name, query, type }: ChatInputProps) => {
  const { onOpen } = useModal();
  const router = useRouter();
  const form = useTextMessageForm();

  /// set the chat input element in focus on initial load and after sending the message
  const {
    formState: { isDirty, isSubmitting },
    setFocus,
  } = form;

  useEffect(() => {
    if (!isDirty) {
      setFocus("content");
    }
  }, [setFocus, isDirty, form]);

  const url = createUrl(apiUrl, query);
  const onSubmitHandler = useModalSubmitFactory({
    method: "POST",
    form,
    schema: createTextMessageSchema,
    url,
    refresh: true,
  });
  // const onSubmitHandler = async (values: z.infer<typeof formSchema>) => {
  //   try {
  //     await axios.post(url, values);
  //     form.reset();
  //     router.refresh();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#313338]" />
                  </button>
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    className="px-14 pr-20 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    autoComplete="off"
                  />
                  <div className="absolute flex gap-x-3 top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                    <button type="submit" disabled={isSubmitting}>
                      <SendHorizontal className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition" />
                    </button>
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
