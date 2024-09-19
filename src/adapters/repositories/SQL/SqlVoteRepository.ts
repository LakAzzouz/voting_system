import { Knex } from "knex";
import { VoteRepositories } from "../../../core/repositories/voteRepositories";
import { SqlVoteMapper } from "../mappers/SqlVoteMapper";
import { Vote } from "../../../core/entities/Vote";

export class SqlVoteRepository implements VoteRepositories {
  constructor(
    private readonly _knex: Knex,
    private readonly _voteMapper: SqlVoteMapper
  ) {}

  async save(vote: Vote): Promise<void> {
    const voteModel = this._voteMapper.fromDomain(vote);
    await this._knex.raw(
      `
        INSERT INTO votes (id, user_id, topic_id, answer, created_at)
        VALUES (:id, :user_id, :topic_id, :answer, :created_at)`,
      {
        id: voteModel.id,
        user_id: voteModel.user_id,
        topic_id: voteModel.topic_id,
        answer: voteModel.answer,
        created_at: voteModel.created_at,
      }
    );

    return;
  }

  async getById(id: string): Promise<Vote | null> {
    const voteModel = await this._knex.raw(
      `SELECT *
        FROM votes
        WHERE id = :id`,
      {
        id: id,
      }
    );

    const vote = this._voteMapper.toDomain(voteModel[0][0]);

    return vote;
  }

  async getByUserId(userId: string): Promise<Vote | null> {
    const voteModel = await this._knex.raw(
      `SELECT *
        FROM votes
        WHERE user_id = :user_id`,
      {
        user_id: userId,
      }
    );

    const vote = this._voteMapper.toDomain(voteModel[0][0]);

    return vote;
  }

  async delete(id: string): Promise<void> {
    await this._knex.raw(
      `DELETE
        FROM votes
        WHERE id = :id`,
      {
        id: id,
      }
    );

    return;
  }
}
