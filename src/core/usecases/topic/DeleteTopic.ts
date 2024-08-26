import { Topic } from "../../entities/Topic";
import { TopicErrors } from "../../errors/TopicErrors";
import { TopicRepositories } from "../../repositories/topicRepositories";
import { Usecases } from "../useCase";

type DeleteTopicInput = {
  id: string;
};

export class DeleteTopic implements Usecases<DeleteTopicInput, Promise<void>> {
  constructor(private readonly _topicRepository: TopicRepositories) {}

  async execute(input: DeleteTopicInput): Promise<void> {
    const { id } = input;

    const topic = await this._topicRepository.getById(id);

    if (!topic) {
      throw new TopicErrors.TopicNotFound();
    }

    await this._topicRepository.delete(id);

    return;
  }
}
