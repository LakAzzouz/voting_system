import { VoteErrors } from "../../errors/VoteErrors";
import { VoteRepositories } from "../../repositories/voteRepositories";
import { Usecases } from "../useCase";

type DeleteVoteInput = {
  id: string;
};

export class DeleteVote implements Usecases<DeleteVoteInput, Promise<void>> {
  constructor(private readonly _voteRepository: VoteRepositories) {}

  async execute(input: DeleteVoteInput): Promise<void> {
    const { id } = input;

    const vote = await this._voteRepository.getById(id);

    if (!vote) {
      throw new VoteErrors.VoteNotFound();
    }

    await this._voteRepository.delete(id);

    return;
  }
}
