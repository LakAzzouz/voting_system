import { VoteModel } from "./VoteModel";

export interface TopicModel {
  id: string;
  title: string;
  description: string;
  votes: VoteModel[];
  created_at: Date;
  updated_at?: Date;
}
