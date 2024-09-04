import { Vote } from "../../entities/Vote";
import { TopicErrors } from "../../errors/TopicErrors";
import { UserErrors } from "../../errors/UserErrors";
import { TopicRepositories } from "../../repositories/topicRepositories";
import { UserRepositories } from "../../repositories/userRepositories";
import { VoteRepositories } from "../../repositories/voteRepositories";
import { Usecases } from "../useCase";

type CreateVoteInput = {
  userId: string;
  topicId: string;
  answer: boolean;
};

export class CreateVote implements Usecases<CreateVoteInput, Promise<Vote>> {
  constructor(
    private readonly _userRepository: UserRepositories,
    private readonly _topicRepository: TopicRepositories,
    private readonly _voteRepository: VoteRepositories
  ) {}

  async execute(input: CreateVoteInput): Promise<Vote> {
    const { userId, topicId, answer } = input;

    const user = await this._userRepository.getById(userId);

    if (!user) {
      throw new UserErrors.NotFound();
    }

    const topic = await this._topicRepository.getById(topicId);

    if (!topic) {
      throw new TopicErrors.NotFound();
    }

    const vote = Vote.create({
      userId,
      topicId,
      answer,
    });

    await this._voteRepository.save(vote);

    return vote;
  }
}
