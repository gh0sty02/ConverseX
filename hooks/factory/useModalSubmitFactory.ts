import axios from "axios";
import router, { useRouter } from "next/navigation";
import { z } from "zod";
import { formSchema } from "../../lib/validation/server";
import { UseFormReturn } from "react-hook-form";
import { useModal } from "@/hooks/useModalStore";

interface useModalSubmitFactoryArgs {
  form: UseFormReturn<{
    name: string;
    imageUrl: string;
  }>;
  url: string;
  method: "POST" | "PATCH";
}

export const useModalSubmitFactory = ({
  method,
  form,
  url,
}: useModalSubmitFactoryArgs) => {
  const router = useRouter();
  const { onClose } = useModal();
  return async (values: z.infer<typeof formSchema>) => {
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
