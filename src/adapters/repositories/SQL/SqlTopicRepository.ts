import { Knex } from "knex";
import { TopicRepositories } from "../../../core/repositories/topicRepositories";
import { SqlTopicMapper } from "../mappers/SqlTopicMapper";
import { Topic } from "../../../core/entities/Topic";
import { TopicErrors } from "../../../core/errors/TopicErrors";

export class SqlTopicRepository implements TopicRepositories {
  constructor(
    private readonly _knex: Knex,
    private readonly _topicMapper: SqlTopicMapper
  ) {}

  async save(topic: Topic): Promise<void> {
    const topicModel = this._topicMapper.fromDomain(topic);
    const votes = topicModel.votes;
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
      for (const vote of votes)
        await this._knex.raw(
        `INSERT INTO votes(id, user_id, topic_id, answer, created_at)
        VALUES (:id, :user_id, :topic_id, :answer, :created_at)`,
          {
            id: vote.id,
            user_id: vote.user_id,
            topic_id: vote.id,
            answer: vote.answer,
            created_at: vote.created_at,
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
          'id', votes.id,
          'user_id', votes.user_id,
          'answer', votes.answer,
          'created_at', votes.created_at
        )
      ) AS votes,
      MAX(topics.title) AS title,
      MAX(topics.description) AS description,
      MAX(topics.created_at) AS created_at,
      MAX(topics.updated_at) AS updated_at
      FROM topics
      LEFT JOIN votes ON topics.id = votes.topic_id
      WHERE topics.id = 'topic_id'
      GROUP BY topics.id`,
      {
        id: id,
      }
    );

    const rawTopic = topicModel[0][0];

    if (!rawTopic) {
      throw new TopicErrors.NotFound();
    }

    if (typeof rawTopic.votes === "string") {
      rawTopic.votes = JSON.parse(rawTopic.votes);
    }

    const topic = this._topicMapper.toDomain(rawTopic);

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
