import { InMemoryVoteRepository } from "../../adapters/repositories/InMemoryVoteRepositories";
import { Vote } from "../../entities/Vote";
import { VoteErrors } from "../../errors/VoteErrors";
import { DataBuilders } from "../../tools/dataBuilders";
import { GetVoteById } from "../../usecases/vote/GetVoteById";

describe("Unit - get vote by id", () => {
  let getVoteById: GetVoteById;
  const voteDb = new Map<string, Vote>();
  const vote = DataBuilders.generateVote();

  beforeAll(async () => {
    const voteRepository = new InMemoryVoteRepository(voteDb);
    getVoteById = new GetVoteById(voteRepository);
  });

  afterEach(async () => {
    voteDb.clear();
  });

  it("Should get vote by id", async () => {
    voteDb.set(vote.props.id, vote);

    const result = await getVoteById.execute({
      id: vote.props.id,
    });

    expect(result.props.id).toBeDefined();
    expect(result.props.userId).toBeDefined();
    expect(result.props.topicId).toBeDefined();
    expect(result.props.answer).toEqual(vote.props.answer);
    expect(result.props.createdAt).toBeDefined();
  });

  it("Should throw an error because vote is not found", async () => {
    voteDb.set(vote.props.id, vote);

    const result = getVoteById.execute({
      id: "wrong_id",
    });

    await expect(result).rejects.toThrow(VoteErrors.VoteNotFound);
  });
});
