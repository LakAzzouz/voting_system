import { v4 } from "uuid";

type VoteProperties = {
  id: string;
  userId: string;
  topicId: string;
  answer: boolean;
  createdAt: Date;
};

export class Vote {
  props: VoteProperties;

  constructor(voteProperties: VoteProperties) {
    this.props = voteProperties;
  }

  static create(props: {userId: string, topicId: string, answer: boolean}): Vote {
    const vote = new Vote({
      id: v4(),
      userId: props.userId,
      topicId: props.topicId,
      answer: props.answer,
      createdAt: new Date(),
    });
    return vote;
  }
}
