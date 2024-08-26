import { Vote } from "../entities/Vote";

export interface VoteRepositories {
  save(vote: Vote): Promise<void>;

  getById(id: string): Promise<Vote | null>;

  getByUserId(userId: string): Promise<Vote | null>;

  delete(id: string): Promise<void>;
}
