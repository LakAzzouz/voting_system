import express from "express";

import { VoteCreateCommand } from "../validation/voteCommands";
import { CreateVote } from "../../core/usecases/vote/CreateVote";
import { SqlUserRepository } from "../../adapters/repositories/SQL/SqlUserRepository";
import { db } from "../../adapters/_test_/tools/db";
import { SqlUserMapper } from "../../adapters/repositories/mappers/SqlUserMapper";
import { SqlTopicMapper } from "../../adapters/repositories/mappers/SqlTopicMapper";
import { SqlVoteMapper } from "../../adapters/repositories/mappers/SqlVoteMapper";
import { SqlTopicRepository } from "../../adapters/repositories/SQL/SqlTopicRepository";
import { SqlVoteRepository } from "../../adapters/repositories/SQL/SqlVoteRepository";
import { GetVoteById } from "../../core/usecases/vote/GetVoteById";
import { GetVoteByUserId } from "../../core/usecases/vote/GetVoteByUserId";
import { DeleteVote } from "../../core/usecases/vote/DeleteVote";

export const voteRouteur = express.Router();

const userMapper = new SqlUserMapper();
const topicMapper = new SqlTopicMapper();
const voteMapper = new SqlVoteMapper();

const userRepository = new SqlUserRepository(db, userMapper);
const topicRepository = new SqlTopicRepository(db, topicMapper);
const voteRepository = new SqlVoteRepository(db, voteMapper);

const createVote = new CreateVote(userRepository, topicRepository, voteRepository);
const getVoteById = new GetVoteById(voteRepository);
const getVoteByUserId = new GetVoteByUserId(voteRepository);
const deleteVote = new DeleteVote(voteRepository);

voteRouteur.post("/create", async (req: express.Request, res: express.Response) => {
    try {
      const { userId, topicId, answer } = VoteCreateCommand.validateVoteCreate(req.body);

      const vote = await createVote.execute({
        userId,
        topicId,
        answer,
      });

      const result = {
        id: vote.props.id,
        userId,
        topicId,
        answer,
        createdAt: vote.props.createdAt,
      };

      return res.status(201).send(result);
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).send(error.message);
      }
    }
  }
);

voteRouteur.get("/:id", async (req: express.Request, res: express.Response) => {
  try {
    const vote = await getVoteById.execute({
      id: req.params.id,
    });

    const result = {
      id: vote.props.id,
      userId: vote.props.userId,
      topicId: vote.props.topicId,
      answer: vote.props.answer,
      createdAt: vote.props.createdAt,
    };

    return res.status(200).send(result);
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
});

voteRouteur.get("/:userId", async (req: express.Request, res: express.Response) => {
    try {
      const vote = await getVoteByUserId.execute({
        userId: req.params.userId,
      });

      const result = {
        id: vote.props.id,
        userId: vote.props.userId,
        topicId: vote.props.topicId,
        answer: vote.props.answer,
        createdAt: vote.props.createdAt,
      };

      return res.status(200).send(result);
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).send(error.message);
      }
    }
  }
);

voteRouteur.delete("/:id", async (req: express.Request, res: express.Response) => {
    try {
      await deleteVote.execute({
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
