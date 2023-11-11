import * as z from "zod";
export const addMemberToServerSchema = z.object({
  inviteCode: z.string().min(1, {
    message: "Member Id is Required",
  }),
  memberId: z.string().min(1, {
    message: "Member Id is Required",
  }),
});
