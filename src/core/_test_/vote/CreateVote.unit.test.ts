import { InMemoryTopicRepositories } from "../../adapters/repositories/InMemoryTopicRepositories";
import { InMemoryUserRepository } from "../../adapters/repositories/InMemoryUserRepositories";
import { InMemoryVoteRepository } from "../../adapters/repositories/InMemoryVoteRepositories";
import { Topic } from "../../entities/Topic";
import { User } from "../../entities/User";
import { Vote } from "../../entities/Vote";
import { TopicErrors } from "../../errors/TopicErrors";
import { UserErrors } from "../../errors/UserErrors";
import { DataBuilders } from "../../tools/dataBuilders";
import { CreateVote } from "../../usecases/vote/CreateVote";

describe("Unit - create vote", () => {
  let createVote: CreateVote;
  const voteDb = new Map<string, Vote>();
  const userDb = new Map<string, User>();
  const topicDb = new Map<string, Topic>();

  const user = DataBuilders.generateUser({
    id: "user_id",
    username: "toto",
    email: "toto@gmail.com",
    password: "Azerty1234!*",
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const vote = DataBuilders.generateVote({
    id: "vote_id",
    userId: "user_id",
    TopicId: "topic_id",
    answer: false,
    createdAt: new Date()
  });

  const topic = DataBuilders.generateTopic({
    id: "topic_id",
    title: "title",
    description: "description",
    votes: [vote],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  beforeAll(async () => {
    const voteRepository = new InMemoryVoteRepository(voteDb);
    const userRepository = new InMemoryUserRepository(userDb);
    const topicRepository = new InMemoryTopicRepositories(topicDb);
    createVote = new CreateVote(userRepository, topicRepository, voteRepository);
  });

  afterEach(async () => {
    voteDb.clear();
    userDb.clear();
    topicDb.clear();
  });

  it("Should create a vote", async () => {
    userDb.set(user.props.id, user);
    topicDb.set(topic.props.id, topic);

    const result = await createVote.execute({
      userId: user.props.id,
      topicId: topic.props.id,
      answer: vote.props.answer,
    });
    
    expect(result.props.id).toBeDefined();
    expect(result.props.userId).toBeDefined();
    expect(result.props.topicId).toBeDefined();
    expect(result.props.answer).toEqual(vote.props.answer);
    expect(result.props.createdAt).toBeDefined();
  });

  it("Should throw an erorr because user is not found", async () => {
    userDb.set(user.props.id, user);
    topicDb.set(topic.props.id, topic);

    const result = createVote.execute({
      userId: "wrong_id",
      topicId: topic.props.id,
      answer: vote.props.answer,
    });

    await expect(result).rejects.toThrow(UserErrors.UserNotFound);
  });

  it("Should throw an error because topic is not found", async () => {
    userDb.set(user.props.id, user);
    topicDb.set(topic.props.id, topic);

    const result = createVote.execute({
      userId: user.props.id,
      topicId: "wrong_id",
      answer: vote.props.answer,
    });

    await expect(result).rejects.toThrow(TopicErrors.TopicNotFound);
  });
});
