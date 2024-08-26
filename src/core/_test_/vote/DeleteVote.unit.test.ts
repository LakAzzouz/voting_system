import { InMemoryVoteRepository } from "../../adapters/repositories/InMemoryVoteRepositories";
import { Vote } from "../../entities/Vote";
import { VoteErrors } from "../../errors/VoteErrors";
import { DataBuilders } from "../../tools/dataBuilders";
import { DeleteVote } from "../../usecases/vote/DeleteVote";

describe("Unit - delete vote", () => {
  let deleteVote: DeleteVote;
  const voteDb = new Map<string, Vote>();
  const vote = DataBuilders.generateVote();

  beforeAll(async () => {
    const voteRepository = new InMemoryVoteRepository(voteDb);
    deleteVote = new DeleteVote(voteRepository);
  });

  afterEach(async () => {
    voteDb.clear();
  });

  it("Should delete vote", async () => {
    voteDb.set(vote.props.id, vote);

    const result = await deleteVote.execute({
      id: vote.props.id,
    });

    voteDb.get(vote.props.id);

    expect(result).toBeUndefined();
  });

  it("Should throw an error because vote is not found", async () => {
    voteDb.set(vote.props.id, vote);

    const result = deleteVote.execute({
      id: "wrong_id",
    });

    voteDb.get(vote.props.id);

    await expect(result).rejects.toThrow(VoteErrors.VoteNotFound);
  });
});
