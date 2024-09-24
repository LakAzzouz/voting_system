import express from "express";
import supertest from "supertest";

import { db } from "../../adapters/_test_/tools/db";
import { SqlVoteMapper } from "../../adapters/repositories/mappers/SqlVoteMapper";
import { SqlVoteRepository } from "../../adapters/repositories/SQL/SqlVoteRepository";
import { DataBuilders } from "../../core/tools/dataBuilders";
import { voteRouteur } from "../routes/vote";
import { SqlUserMapper } from "../../adapters/repositories/mappers/SqlUserMapper";
import { SqlUserRepository } from "../../adapters/repositories/SQL/SqlUserRepository";
import { SqlTopicRepository } from "../../adapters/repositories/SQL/SqlTopicRepository";
import { SqlTopicMapper } from "../../adapters/repositories/mappers/SqlTopicMapper";

const app = express();

describe("E2E - vote", () => {
  let voteRepository: SqlVoteRepository;
  let userRepository: SqlUserRepository;
  let topicRepository: SqlTopicRepository;

  const vote = DataBuilders.generateVote();
  const user = DataBuilders.generateUser();
  const topic = DataBuilders.generateTopic();

  beforeAll(async () => {
    app.use(express.json());
    app.use("/votes", voteRouteur);

    const voteMapper = new SqlVoteMapper();
    const userMapper = new SqlUserMapper();
    const topicMapper = new SqlTopicMapper();

    voteRepository = new SqlVoteRepository(db, voteMapper);
    userRepository = new SqlUserRepository(db, userMapper);
    topicRepository = new SqlTopicRepository(db, topicMapper);
  });

  afterEach(async () => {
    await db.raw(`TRUNCATE TABLE votes`);
    await db.raw(`TRUNCATE TABLE users`);
    await db.raw(`TRUNCATE TABLE topics`);
  });

  it("POST /votes/create", async () => {
    await userRepository.save(user);
    await topicRepository.save(topic);

    const response = await supertest(app).post("/votes/create").send({
      userId: user.props.id,
      topicId: topic.props.id,
      answer: vote.props.answer,
    });

    const responseBody = response.body;
    const responseStatus = response.status;

    expect(responseBody.id).toBeDefined();
    expect(responseBody.userId).toEqual(user.props.id);
    expect(responseBody.topicId).toEqual(topic.props.id);
    expect(responseBody.answer).toEqual(vote.props.answer);
    expect(responseBody.createdAt).toBeDefined();
    expect(responseStatus).toBe(201);
    jest.setTimeout(1000);
  });

  it("POST /votes/create should return a status 400", async () => {
    const response = await supertest(app).post("/votes/create").send({
      userId: user.props.id,
      topicId: topic.props.id,
      answer: vote.props.answer,
    });

    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
    jest.setTimeout(1000);
  });

  it("GET /votes/:id", async () => {
    await voteRepository.save(vote);
    await userRepository.save(user);
    await topicRepository.save(topic);

    const response = await supertest(app).get(`/votes/${vote.props.id}`);

    const responseBody = response.body;
    const responseStatus = response.status;

    expect(responseBody.id).toBeDefined();
    expect(responseBody.userId).toEqual(user.props.id);
    expect(responseBody.topicId).toEqual(topic.props.id);
    expect(responseBody.answer).toEqual(0 | 1);
    expect(responseBody.createdAt).toBeDefined();
    expect(responseStatus).toBe(200);
    jest.setTimeout(1000);
  });

  it("GET /votes/:id should return a status 400", async () => {
    const response = await supertest(app).get(`/votes/${vote.props.id}`);

    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
  });

  it("GET /votes/by_user_id/:userId", async () => {
    await voteRepository.save(vote);
    await userRepository.save(user);
    await topicRepository.save(topic);

    const response = await supertest(app).get(
      `/votes/by_user_id/${user.props.id}`
    );

    const responseBody = response.body;
    const responseStatus = response.status;

    expect(responseBody.id).toBeDefined();
    expect(responseBody.userId).toEqual(user.props.id);
    expect(responseBody.topicId).toEqual(topic.props.id);
    expect(responseBody.answer).toEqual(0 | 1);
    expect(responseBody.createdAt).toBeDefined();
    expect(responseStatus).toBe(200);
    jest.setTimeout(1000);
  });

  it("GET /votes/by_user_id/:userId should return a status 400", async () => {
    const response = await supertest(app).get(
      `/votes/by_user_id/${user.props.id}`
    );

    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
    jest.setTimeout(1000);
  });

  it("DELETE /votes/:id", async () => {
    await voteRepository.save(vote);
    await userRepository.save(user);
    await topicRepository.save(topic);

    const response = await supertest(app).delete(`/votes/${vote.props.id}`);

    const responseStatus = response.status;

    expect(responseStatus).toBe(202);
    jest.setTimeout(1000);
  });

  it("DELETE /votes/:id should return a status 400", async () => {
    const response = await supertest(app).delete(`/votes/${vote.props.id}`);

    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
  });
});
