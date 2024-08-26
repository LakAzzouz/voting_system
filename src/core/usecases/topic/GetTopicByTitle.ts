import { Topic } from "../../entities/Topic";
import { TopicErrors } from "../../errors/TopicErrors";
import { TopicRepositories } from "../../repositories/topicRepositories";
import { Usecases } from "../useCase";

type GetTopicByTitleInput = {
  title: string;
};

export class GetTopicByTitle implements Usecases<GetTopicByTitleInput, Promise<Topic>>{
  constructor(private readonly _topicRepository: TopicRepositories) {}

  async execute(input: GetTopicByTitleInput): Promise<Topic> {
    const { title } = input;

    const topic = await this._topicRepository.getByTitle(title);

    if(!topic) {
        throw new TopicErrors.TopicNotFound();
    }

    return topic;
  }
}
