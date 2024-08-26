import { Topic } from "../../entities/Topic";
import { TopicRepositories } from "../../repositories/topicRepositories";

export class InMemoryTopicRepositories implements TopicRepositories {
  map: Map<string, Topic>;

  constructor(map: Map<string, Topic>) {
    this.map = map;
  }
  async save(topic: Topic): Promise<void> {
    this.map.set(topic.props.id, topic);
    return;
  }

  async getById(id: string): Promise<Topic | null> {
    const topic = this.map.get(id);
    if (!topic) {
      return null;
    }
    return topic;
  }

  async getByTitle(title: string): Promise<Topic | null> {
    const arr = Array.from(this.map.values());
    const topic = arr.find((elm) => elm.props.title === title)
    if (!topic) {
      return null;
    }
    return topic;
  }

  async delete(id: string): Promise<void> {
    this.map.delete(id);
    return;
  }
}
