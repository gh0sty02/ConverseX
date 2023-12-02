import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

import { useModal } from "@/hooks/useModalStore";
import { createServerSchema } from "@/lib/validation/serverSchema";
import { createChannelSchema } from "@/lib/validation/channelSchema";
import { createTextMessageSchema } from "@/lib/validation/textMessageSchema";
import { createFileMessageSchema } from "@/lib/validation/useFileMessageSchema";

interface useModalSubmitFactoryArgs {
  form?: UseFormReturn<
    z.infer<
      | typeof createChannelSchema
      | typeof createServerSchema
      | typeof createTextMessageSchema
      | typeof createFileMessageSchema
    >
  >;
  url: string;
  method: "POST" | "PATCH";
  refresh: boolean;
  extraValues?: Record<string, any>;
  schema:
    | typeof createServerSchema
    | typeof createChannelSchema
    | typeof createTextMessageSchema
    | typeof createFileMessageSchema;
}

export const useModalSubmitFactory = ({
  method,
  form,
  url,
  schema,
  refresh,
}: useModalSubmitFactoryArgs) => {
  const router = useRouter();
  const { onClose } = useModal();
  return async (values: z.infer<typeof schema>) => {
    try {
      await axios({
        url,
        method,
        data: values,
      });

      if (form) {
        form.reset();
      }
      if (refresh) {
        router.refresh();
      }
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
};
