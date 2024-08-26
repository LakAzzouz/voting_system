import { InMemoryTopicRepositories } from "../../adapters/repositories/InMemoryTopicRepositories";
import { Topic } from "../../entities/Topic";
import { TopicErrors } from "../../errors/TopicErrors";
import { DataBuilders } from "../../tools/dataBuilders";
import { GetTopicByTitle } from "../../usecases/topic/GetTopicByTitle";

describe("Unit - get topic by title", () => {
  let getTopicByTitle: GetTopicByTitle;
  const topicDB = new Map<string, Topic>();
  const topic = DataBuilders.generateTopic();

  beforeAll(async () => {
    const topicRepository = new InMemoryTopicRepositories(topicDB);
    getTopicByTitle = new GetTopicByTitle(topicRepository);
  });

  afterEach(async () => {
    topicDB.clear();
  });

  it("Should get topic by title", async () => {
    topicDB.set(topic.props.id, topic);

    const result = await getTopicByTitle.execute({
      title: topic.props.title,
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
    topicDB.set(topic.props.id, topic);

    const result = getTopicByTitle.execute({
      title: "wrong_title",
    });

    await expect(result).rejects.toThrow(TopicErrors.TopicNotFound);
  });
});
