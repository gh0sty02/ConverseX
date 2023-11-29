import * as z from "zod";

export const createTextMessageSchema = z.object({
  content: z.string().min(1),
});
