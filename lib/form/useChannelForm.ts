import { zodResolver } from "@hookform/resolvers/zod";
import { Channel, ChannelType } from "@prisma/client";
import { UseFormReturn, useForm } from "react-hook-form";
import { createChannelSchema } from "../validation/channelSchema";
import * as z from "zod";

export const useCreateChannelForm = (channel?: Channel): UseFormReturn<any> => {
  return useForm({
    resolver: zodResolver(createChannelSchema),
    defaultValues: {
      name: "",
      type: channel?.type || ChannelType.TEXT,
    },
  });
};
