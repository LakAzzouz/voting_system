import { v4 } from "uuid";
import { User } from "../entities/User";
import { Vote } from "../entities/Vote";
import { fa, faker } from "@faker-js/faker";
import { Topic } from "../entities/Topic";

type GenerateUser = {
  id?: string;
  username?: string;
  email?: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type GenerateVote = {
  id?: string;
  userId?: string;
  TopicId?: string;
  answer?: boolean;
  createdAt?: Date;
};

type GenerateTopic = {
  id?: string;
  title?: string;
  description?: string;
  votes?: Vote[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class DataBuilders {
  static generateUser(props?: GenerateUser): User {
    return new User({
      id: props?.id ? props.id : v4(),
      username: props?.username ? props.username : faker.internet.userName(),
      email: props?.email ? props.email : faker.internet.email(),
      password: props?.password ? props.password : "Azerty1234!",
      createdAt: props?.createdAt ? props.createdAt : faker.date.recent(),
      updatedAt: props?.updatedAt ? props.updatedAt : new Date(),
    });
  }

  static generateVote(props?: GenerateVote): Vote {
    return new Vote({
      id: props?.id ? props.id : v4(),
      userId: props?.userId ? props.userId : v4(),
      topicId: props?.TopicId ? props.TopicId : v4(),
      answer: props?.answer ? props.answer : true || false,
      createdAt: props?.createdAt ? props.createdAt : faker.date.recent(),
    });
  }

  static generateTopic(props?: GenerateTopic): Topic {
    return new Topic({
      id: props?.id ? props.id : v4(),
      title: props?.title ? props.title : "title",
      description: props?.description ? props.description : "description",
      votes: props?.votes ? props.votes : [DataBuilders.generateVote()],
      createdAt: props?.createdAt ? props.createdAt : faker.date.recent(),
      updatedAt: props?.updatedAt ? props.updatedAt : new Date(),
    });
  }
}
