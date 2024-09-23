import { z } from "zod";

export const topicCreateSchema = z.object({
  voteId: z.string(),
  title: z.string(),
  description: z.string(),
  votes: z.any()
});

type TopicCreateSchema = z.infer<typeof topicCreateSchema>;

export class TopicCreateCommannd {
  static validateTopicCreate(body: any): TopicCreateSchema {
    const validation = topicCreateSchema.safeParse(body);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }
    return validation.data;
  }
}
