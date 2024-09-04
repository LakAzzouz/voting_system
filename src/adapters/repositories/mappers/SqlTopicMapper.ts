import { Topic } from "../../../core/entities/Topic";
import { TopicModel } from "../models/TopicModel";
import { Mapper } from "./Mapper";

export class SqlTopicMapper implements Mapper<TopicModel, Topic> {
  toDomain(raw: TopicModel): Topic {
    const topic = new Topic({
      id: raw.id,
      title: raw.title,
      description: raw.description,
      votes: raw.votes.map((elm) => {
        return {
          props: {
            id: elm.id,
            topicId: elm.topic_id,
            userId: elm.user_id,
            answer: elm.answer,
            createdAt: elm.created_at,
          },
        };
      }),
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
      votes: data.props.votes.map((elm) => {
        return {
          id: elm.props.id,
          topic_id: elm.props.topicId,
          user_id: elm.props.userId,
          answer: elm.props.answer,
          created_at: elm.props.createdAt,
        };
      }),
      created_at: data.props.createdAt,
      updated_at: data.props.updatedAt,
    };
    return topicModel;
  }
}
