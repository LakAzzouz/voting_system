import { InMemoryTopicRepositories } from "../../adapters/repositories/InMemoryTopicRepositories";
import { Topic } from "../../entities/Topic";
import { TopicErrors } from "../../errors/TopicErrors";
import { DataBuilders } from "../../tools/dataBuilders";
import { DeleteTopic } from "../../usecases/topic/DeleteTopic";

describe("Unit - delete topic", () => {
  let deleteTopic: DeleteTopic;
  const topicDb = new Map<string, Topic>();
  const topic = DataBuilders.generateTopic();

  beforeAll(async () => {
    const topicRepository = new InMemoryTopicRepositories(topicDb);
    deleteTopic = new DeleteTopic(topicRepository);
  });

  afterEach(async () => {
    topicDb.clear();
  });

  it("Delete topic", async () => {
    topicDb.set(topic.props.id, topic);

    const result = await deleteTopic.execute({
      id: topic.props.id,
    });

    topicDb.get(topic.props.id);

    expect(result).toBeUndefined();
  });

  it("Should throw an error because topic is not found", async () => {
    topicDb.set(topic.props.id, topic);

    const result = deleteTopic.execute({
      id: "wrong_id",
    });

    await expect(result).rejects.toThrow(TopicErrors.TopicNotFound);
  });
});
