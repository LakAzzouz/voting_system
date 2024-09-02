import { DataBuilders } from "../../../core/tools/dataBuilders";
import { SqlTopicRepository } from "../../repositories/SQL/SqlTopicRepository";
import { SqlTopicMapper } from "../../repositories/mappers/SqlTopicMapper";
import { db } from "../tools/db";

describe("Integ - sql topic repository", () => {
  let topicMapper: SqlTopicMapper;
  let topicRepository: SqlTopicRepository;
  const topic = DataBuilders.generateTopic();
  const vote = DataBuilders.generateVote();

  beforeAll(async () => {
    topicMapper = new SqlTopicMapper();
    topicRepository = new SqlTopicRepository(db, topicMapper);
  });

  afterEach(async () => {
    db.raw(`TRUNCATE TABLE topics`);
  });

  it("Should save a topic and get it by id", async () => {
    await topicRepository.save(topic);

    const result = await topicRepository.getById(topic.props.id);

    console.log(result?.props.votes)

    expect(result?.props.id).toBeDefined();
    expect(result?.props.title).toEqual(topic.props.title);
    expect(result?.props.description).toEqual(topic.props.description);
    // expect(result?.props.votes[0].props.id).toBeDefined();
    // expect(result?.props.votes[0].props.userId).toBeDefined();
    // expect(result?.props.votes[0].props.topicId).toBeDefined();
    // expect(result?.props.votes[0].props.answer).toEqual(vote.props.answer);
    // expect(result?.props.votes[0].props.createdAt).toBeDefined();
    expect(result?.props.createdAt).toBeDefined();
    expect(result?.props.updatedAt).toBeDefined();
  });

  it("Should get topic by title", async () => {
    await topicRepository.save(topic);

    const result = await topicRepository.getByTitle(topic.props.title);

    expect(result?.props.id).toBeDefined();
    expect(result?.props.title).toEqual(topic.props.title);
    expect(result?.props.description).toEqual(topic.props.description);
    // expect(result?.props.votes[0].props.id).toBeDefined();
    // expect(result?.props.votes[0].props.userId).toBeDefined();
    // expect(result?.props.votes[0].props.topicId).toBeDefined();
    // expect(result?.props.votes[0].props.answer).toEqual(vote.props.answer);
    // expect(result?.props.votes[0].props.createdAt).toBeDefined();
    expect(result?.props.updatedAt).toBeDefined();
  });

  it("Should delete topic", async () => {
    await topicRepository.save(topic);

    const result = await topicRepository.delete(topic.props.id);

    expect(result).toBeUndefined();
  });
});
