import { Topic } from "../../entities/Topic";
import { Vote } from "../../entities/Vote";
import { VoteErrors } from "../../errors/VoteErrors";
import { TopicRepositories } from "../../repositories/topicRepositories";
import { VoteRepositories } from "../../repositories/voteRepositories";
import { Usecases } from "../useCase";

type CreateTopicInput = {
  voteId: string;
  title: string;
  description: string;
  votes: Vote[];
};

export class CreateTopic implements Usecases<CreateTopicInput, Promise<Topic>> {
  constructor(
    private readonly _topicRepository: TopicRepositories,
    private readonly _voteRepository: VoteRepositories
  ) {}

  async execute(input: CreateTopicInput): Promise<Topic> {
    const { voteId, title, description } = input;

    const vote = await this._voteRepository.getById(voteId);

    if (!vote) {
      throw new VoteErrors.VoteNotFound();
    }

    const topic = Topic.create({
      title,
      description,
      votes: [vote],
    });

    await this._topicRepository.save(topic);

    return topic;
  }
}
