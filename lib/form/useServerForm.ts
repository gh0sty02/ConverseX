import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { createServerSchema } from "@/lib/validation/serverSchema";

export const useCreateServerForm = (): UseFormReturn<any> => {
  return useForm({
    resolver: zodResolver(createServerSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });
};
