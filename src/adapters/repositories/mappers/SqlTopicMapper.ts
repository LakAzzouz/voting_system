import { Topic } from "../../../core/entities/Topic";
import { TopicModel } from "../models/TopicModel";
import { Mapper } from "./Mapper";

export class SqlTopicMapper implements Mapper<TopicModel, Topic> {
  toDomain(raw: TopicModel): Topic {
    const topic = new Topic({
      id: raw.id,
      title: raw.title,
      description: raw.description,
      votes: raw.votes,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
    return topic;
  }

  fromDomain(data: Topic): TopicModel {
    const topicModel: TopicModel = {
      id: data.props.id,
      title: data.props.title,
      description: data.props.description,
      votes: data.props.votes,
      created_at: data.props.createdAt,
      updated_at: data.props.updatedAt,
    };
    return topicModel;
  }
}
