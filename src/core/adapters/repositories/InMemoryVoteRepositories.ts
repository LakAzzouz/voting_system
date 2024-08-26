import { Vote } from "../../entities/Vote";
import { VoteRepositories } from "../../repositories/voteRepositories";

export class InMemoryVoteRepository implements VoteRepositories {
  map: Map<string, Vote>;

  constructor(map: Map<string, Vote>) {
    this.map = map;
  }
  async save(vote: Vote): Promise<void> {
    this.map.set(vote.props.id, vote);
    return;
  }

  async getById(id: string): Promise<Vote | null> {
    const vote = this.map.get(id);
    if (!vote) {
      return null;
    }
    return vote;
  }

  async getByUserId(userId: string): Promise<Vote | null> {
    const arr = Array.from(this.map.values());
    const vote = arr.find((elm) => elm.props.userId === userId);
    if (!vote) {
      return null;
    }
    return vote;
  }

  async delete(id: string): Promise<void> {
    this.map.delete(id);
    return;
  }
}
