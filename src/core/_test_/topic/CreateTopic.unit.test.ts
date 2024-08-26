import { InMemoryTopicRepositories } from "../../adapters/repositories/InMemoryTopicRepositories";
import { InMemoryVoteRepository } from "../../adapters/repositories/InMemoryVoteRepositories";
import { Topic } from "../../entities/Topic";
import { Vote } from "../../entities/Vote";
import { VoteErrors } from "../../errors/VoteErrors";
import { DataBuilders } from "../../tools/dataBuilders";
import { CreateTopic } from "../../usecases/topic/CreateTopic";

describe("Unit - create topic", () => {
  let createTopic: CreateTopic;
  const topicDb = new Map<string, Topic>();
  const voteDb = new Map<string, Vote>();
  const topic = DataBuilders.generateTopic();
  const vote = DataBuilders.generateVote();

  beforeAll(async () => {
    const topicRepository = new InMemoryTopicRepositories(topicDb);
    const voteRepository = new InMemoryVoteRepository(voteDb);
    createTopic = new CreateTopic(topicRepository, voteRepository);
  });

  afterEach(async () => {
    topicDb.clear();
    voteDb.clear();
  });

  it("Should create Topic", async () => {
    voteDb.set(vote.props.id, vote);

    const result = await createTopic.execute({
      voteId: vote.props.id,
      title: topic.props.title,
      description: topic.props.description,
      votes: [vote],
    });

    expect(result.props.id).toBeDefined();
    expect(result.props.title).toEqual(topic.props.title);
    expect(result.props.description).toEqual(topic.props.description);
    expect(result.props.votes[0].props.id).toBeDefined();
    expect(result.props.votes[0].props.userId).toBeDefined();
    expect(result.props.votes[0].props.topicId).toBeDefined();
    expect(result.props.votes[0].props.answer).toEqual(topic.props.votes[0].props.answer);
    expect(result.props.votes[0].props.createdAt).toBeDefined();
    expect(result.props.createdAt).toBeDefined();
    expect(result.props.updatedAt).toBeDefined();
  });

  it("Should throw an error because vote is not found", async () => {
    voteDb.set(vote.props.id, vote);

    const result = createTopic.execute({
      voteId: "wrong_vote_id",
      title: topic.props.title,
      description: topic.props.description,
      votes: [vote],
    });

    await expect(result).rejects.toThrow(VoteErrors.VoteNotFound);
  })
});
