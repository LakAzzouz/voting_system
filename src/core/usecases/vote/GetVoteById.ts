import { Vote } from "../../entities/Vote";
import { VoteErrors } from "../../errors/VoteErrors";
import { VoteRepositories } from "../../repositories/voteRepositories";
import { Usecases } from "../useCase";

type GetVoteByIdInput = {
  id: string;
};

export class GetVoteById implements Usecases<GetVoteByIdInput, Promise<Vote>> {
  constructor(private readonly _voteRepository: VoteRepositories) {}

  async execute(input: GetVoteByIdInput): Promise<Vote> {
    const { id } = input;

    const vote = await this._voteRepository.getById(id);

    if (!vote) {
      throw new VoteErrors.VoteNotFound();
    }

    return vote;
  }
}
