import { InMemoryTopicRepositories } from "../../adapters/repositories/InMemoryTopicRepositories";
import { Topic } from "../../entities/Topic";
import { TopicErrors } from "../../errors/TopicErrors";
import { DataBuilders } from "../../tools/dataBuilders";
import { GetTopicById } from "../../usecases/topic/GetTopicById";

describe("Unit - get topic by id", () => {
  let getTopicById: GetTopicById;
  const topicDb = new Map<string, Topic>();
  const topic = DataBuilders.generateTopic();

  beforeAll(async () => {
    const topicRepository = new InMemoryTopicRepositories(topicDb);
    getTopicById = new GetTopicById(topicRepository);
  });

  afterEach(async () => {
    topicDb.clear();
  });

  it("Should get topic by id", async () => {
    topicDb.set(topic.props.id, topic);

    const result = await getTopicById.execute({
      id: topic.props.id,
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

  it("Should throw an error because topic is not found", async () => {
    topicDb.set(topic.props.id, topic);

    const result = getTopicById.execute({
      id: "wrong_id",
    });

    await expect(result).rejects.toThrow(TopicErrors.TopicNotFound);
  });
});
