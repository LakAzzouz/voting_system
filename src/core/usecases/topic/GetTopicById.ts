import { Topic } from "../../entities/Topic";
import { TopicErrors } from "../../errors/TopicErrors";
import { TopicRepositories } from "../../repositories/topicRepositories";
import { Usecases } from "../useCase";

type GetTopicByIdInput = {
  id: string;
};

export class GetTopicById implements Usecases<GetTopicByIdInput, Promise<Topic>> {
  constructor(private readonly _topicRepository: TopicRepositories) {}

  async execute(input: GetTopicByIdInput): Promise<Topic> {
    const { id } = input;

    const topic = await this._topicRepository.getById(id);

    if(!topic) {
        throw new TopicErrors.NotFound();
    }

    return topic;
  }
}
