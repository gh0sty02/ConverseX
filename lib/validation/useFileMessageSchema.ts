import * as z from "zod";

export const createFileMessageSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Server Image is Required",
  }),
});
