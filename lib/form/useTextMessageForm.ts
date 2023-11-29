import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { createTextMessageSchema } from "@/lib/validation/textMessageSchema";

export const useTextMessageForm = (): UseFormReturn<any> => {
  return useForm({
    resolver: zodResolver(createTextMessageSchema),
    defaultValues: {
      content: "",
    },
  });
};
