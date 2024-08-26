import { Vote } from "../../entities/Vote";
import { VoteErrors } from "../../errors/VoteErrors";
import { VoteRepositories } from "../../repositories/voteRepositories";
import { Usecases } from "../useCase";

type GetVoteByUserIdInput = {
  userId: string;
};

export class GetVoteByUserId implements Usecases<GetVoteByUserIdInput, Promise<Vote>> {
  constructor(private readonly _voteRepository: VoteRepositories) {}

  async execute(input: GetVoteByUserIdInput): Promise<Vote> {
    const { userId } = input;

    const vote = await this._voteRepository.getByUserId(userId);

    if (!vote) {
      throw new VoteErrors.VoteNotFound();
    }

    return vote;
  }
}
