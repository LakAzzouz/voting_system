import { v4 } from "uuid";
import { Vote } from "./Vote";

type TopicProperties = {
  id: string;
  title: string;
  description: string;
  votes: Vote[];
  createdAt: Date;
  updatedAt?: Date;
};

export class Topic {
  props: TopicProperties;

  constructor(sujetProperties: TopicProperties) {
    this.props = sujetProperties;
  }

  static create(props: {title: string, description: string, votes: Vote[]}): Topic {
    const sujet = new Topic({
      id: v4(),
      title: props.title,
      description: props.description,
      votes: props.votes,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return sujet;
  }
}
