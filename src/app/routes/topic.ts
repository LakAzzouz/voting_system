import express from "express";

import { TopicCreateCommannd } from "../validation/topicCommands";
import { CreateTopic } from "../../core/usecases/topic/CreateTopic";
import { SqlTopicRepository } from "../../adapters/repositories/SQL/SqlTopicRepository";
import { SqlTopicMapper } from "../../adapters/repositories/mappers/SqlTopicMapper";
import { db } from "../../adapters/_test_/tools/db";
import { SqlVoteMapper } from "../../adapters/repositories/mappers/SqlVoteMapper";
import { SqlVoteRepository } from "../../adapters/repositories/SQL/SqlVoteRepository";
import { GetTopicById } from "../../core/usecases/topic/GetTopicById";
import { GetTopicByTitle } from "../../core/usecases/topic/GetTopicByTitle";
import { DeleteTopic } from "../../core/usecases/topic/DeleteTopic";

export const topicRouter = express.Router();

const topicMapper = new SqlTopicMapper();
const voteMapper = new SqlVoteMapper();

const topicRepository = new SqlTopicRepository(db, topicMapper);
const voteRepository = new SqlVoteRepository(db, voteMapper);

const createTopic = new CreateTopic(topicRepository, voteRepository);
const getTopicById = new GetTopicById(topicRepository);
const getTopicByTitle = new GetTopicByTitle(topicRepository);
const deleteTopic = new DeleteTopic(topicRepository);

topicRouter.post("/create", async (req: express.Request, res: express.Response) => {
    try {
      const { voteId, title, description, votes } = TopicCreateCommannd.validateTopicCreate(req.body);

      const topic = await createTopic.execute({
        voteId,
        title,
        description,
        votes,
      });

      const result = {
        id: topic.props.id,
        title,
        description,
        votes,
        createdAt: topic.props.createdAt,
      };

      return res.status(201).send(result);
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).send(error.message);
      }
    }
  }
);

topicRouter.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const topic = await getTopicById.execute({
      id: req.params.id,
    });

    const result = {
      id: topic.props.id,
      title: topic.props.title,
      description: topic.props.description,
      votes: topic.props.votes,
      createdAt: topic.props.createdAt,
    };

    return res.status(200).send(result);
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
});

topicRouter.get("/by_title/:title", async (req: express.Request, res: express.Response) => {
    try {
      const topic = await getTopicByTitle.execute({
        title: req.params.title,
      });

      const result = {
        id: topic.props.id,
        title: topic.props.title,
        description: topic.props.description,
        votes: topic.props.votes,
        createdAt: topic.props.createdAt,
      };

      return res.status(200).send(result);
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).send(error.message);
      }
    }
  }
);

topicRouter.delete("/:id", async (req: express.Request, res: express.Response) => {
    try {
      await deleteTopic.execute({
        id: req.params.id,
      });

      return res.sendStatus(202);
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).send(error.message);
      }
    }
  }
);
