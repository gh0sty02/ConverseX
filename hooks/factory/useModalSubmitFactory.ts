import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

import { useModal } from "@/hooks/useModalStore";
import { createServerSchema } from "@/lib/validation/serverSchema";
import { createChannelSchema } from "@/lib/validation/channelSchema";

interface useModalSubmitFactoryArgs {
  form: UseFormReturn<
    z.infer<typeof createChannelSchema | typeof createServerSchema>
  >;
  url: string;
  method: "POST" | "PATCH";
  schema: typeof createServerSchema | typeof createChannelSchema;
}

export const useModalSubmitFactory = ({
  method,
  form,
  url,
  schema,
}: useModalSubmitFactoryArgs) => {
  const router = useRouter();
  const { onClose } = useModal();
  return async (values: z.infer<typeof schema>) => {
    try {
      await axios({ url, method, data: values });

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };
};
