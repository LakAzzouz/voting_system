import { Knex } from "knex";
import { TopicRepositories } from "../../../core/repositories/topicRepositories";
import { SqlTopicMapper } from "../mappers/SqlTopicMapper";
import { Topic } from "../../../core/entities/Topic";

export class SqlTopicRepository implements TopicRepositories {
  constructor(
    private readonly _knex: Knex,
    private readonly _topicMapper: SqlTopicMapper
  ) {}

  async save(topic: Topic): Promise<void> {
    const topicModel = this._topicMapper.fromDomain(topic);
    const id = topicModel.votes.map((elm) => elm.props.id);
    const user_id = topicModel.votes.map((elm) => elm.props.userId);
    const topic_id = topicModel.votes.map((elm) => elm.props.topicId);
    const answer = topicModel.votes.map((elm) => elm.props.answer);
    const created_at = topicModel.votes.map((elm) => elm.props.createdAt);
    const tx = await this._knex.transaction();
    try {
      await this._knex.raw(
        `INSERT INTO topics (id, title, description, created_at, updated_at)
        VALUES (:id, :title, :description, :created_at, :updated_at)`,
        {
          id: topicModel.id,
          title: topicModel.title,
          description: topicModel.description,
          created_at: topicModel.created_at,
          updated_at: topicModel.updated_at,
        }
      );
      await this._knex.raw(
        `INSERT INTO votes(id, user_id, topic_id, answer, created_at)
        VALUES (:id, :user_id, :topic_id, :answer, :created_at)`,
        {
          id,
          user_id,
          topic_id,
          answer,
          created_at,
        }
      );
      await tx.commit();
    } catch (error) {
      await tx.rollback();
    }

    return;
  }

  async getById(id: string): Promise<Topic | null> {
    const topicModel = await this._knex.raw(
      `SELECT
      topics.id AS id,
      JSON_ARRAYAGG(
          JSON_OBJECT(
              'vote_id', votes.id,
              'user_id', votes.user_id,
              'answer', votes.answer
          )
      ) AS votes,
      MAX(topics.title) AS title,
      MAX(topics.description) AS description,
      MAX(topics.created_at) AS created_at,
      MAX(topics.updated_at) AS updated_at
      FROM topics
      LEFT JOIN votes ON topics.id = votes.topic_id
      WHERE topics.id = :id
      GROUP BY topics.id;`,
      {
        id: id,
      }
    );

    const topic = this._topicMapper.toDomain(topicModel[0][0]);

    return topic;
  }

  async getByTitle(title: string): Promise<Topic | null> {
    const topicModel = await this._knex.raw(
      `SELECT *
        FROM topics
        WHERE title = :title`,
      {
        title: title,
      }
    );

    const topic = this._topicMapper.toDomain(topicModel[0][0]);

    return topic;
  }

  async delete(id: string): Promise<void> {
    await this._knex.raw(
      `DELETE
        FROM topics
        WHERE id = :id`,
      {
        id: id,
      }
    );

    return;
  }
}
