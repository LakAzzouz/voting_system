import { z } from "zod";

export const voteCreateSchema = z.object({
  userId: z.string(),
  topicId: z.string(),
  answer: z.boolean(),
});

type VoteCreateSchema = z.infer<typeof voteCreateSchema>;

export class VoteCreateCommand {
  static validateVoteCreate(body: any): VoteCreateSchema {
    const validation = voteCreateSchema.safeParse(body);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }
    return validation.data;
  }
}
