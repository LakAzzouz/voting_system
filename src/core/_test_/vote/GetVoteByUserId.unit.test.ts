import { InMemoryVoteRepository } from "../../adapters/repositories/InMemoryVoteRepositories";
import { Vote } from "../../entities/Vote";
import { VoteErrors } from "../../errors/VoteErrors";
import { DataBuilders } from "../../tools/dataBuilders";
import { GetVoteByUserId } from "../../usecases/vote/GetVoteByUserId";

describe("Unit - get vote by user id", () => {
  let getVoteByUserId: GetVoteByUserId;
  const voteDb = new Map<string, Vote>();
  const vote = DataBuilders.generateVote();

  beforeAll(async () => {
    const voteRepository = new InMemoryVoteRepository(voteDb);
    getVoteByUserId = new GetVoteByUserId(voteRepository);
  });

  afterEach(async () => {
    voteDb.clear();
  });

  it("Should get vote by user id", async () => {
    voteDb.set(vote.props.id, vote);

    const result = await getVoteByUserId.execute({
      userId: vote.props.userId,
    });

    expect(result.props.id).toBeDefined();
    expect(result.props.userId).toBeDefined();
    expect(result.props.topicId).toBeDefined();
    expect(result.props.answer).toEqual(vote.props.answer);
    expect(result.props.createdAt).toBeDefined();
  });

  it("Should throw an error because vote is not found", async () => {
    voteDb.set(vote.props.id, vote);

    const result = getVoteByUserId.execute({
      userId: "wrong_id",
    });

    await expect(result).rejects.toThrow(VoteErrors.NotFound);
  });
});
