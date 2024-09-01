export interface VoteModel {
  id: string;
  user_id: string;
  topic_id: string;
  answer: boolean;
  created_at: Date;
}
