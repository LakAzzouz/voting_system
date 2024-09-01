import { Vote } from "../../../core/entities/Vote";
import { VoteModel } from "../models/VoteModel";
import { Mapper } from "./Mapper";

export class SqlVoteMapper implements Mapper<VoteModel, Vote> {
  toDomain(raw: VoteModel): Vote {
    const vote = new Vote({
      id: raw.id,
      userId: raw.user_id,
      topicId: raw.topic_id,
      answer: raw.answer,
      createdAt: raw.created_at,
    });
    return vote;
  }

  fromDomain(data: Vote): VoteModel {
    const voteModel: VoteModel = {
      id: data.props.id,
      user_id: data.props.userId,
      topic_id: data.props.topicId,
      answer: data.props.answer,
      created_at: data.props.createdAt,
    };
    return voteModel;
  }
}
