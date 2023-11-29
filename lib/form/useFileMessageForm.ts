import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { createFileMessageSchema } from "@/lib/validation/useFileMessageSchema";

export const useFileMessageForm = (): UseFormReturn<any> => {
  return useForm({
    resolver: zodResolver(createFileMessageSchema),
    defaultValues: {
      fileUrl: "",
    },
  });
};
