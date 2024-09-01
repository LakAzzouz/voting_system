import { Vote } from "../../../core/entities/Vote";

export interface TopicModel {
  id: string;
  title: string;
  description: string;
  votes: Vote[];
  created_at: Date;
  updated_at?: Date;
}
