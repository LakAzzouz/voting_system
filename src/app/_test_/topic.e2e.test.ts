import express from "express";
import supertest from "supertest";

import { SqlTopicRepository } from "../../adapters/repositories/SQL/SqlTopicRepository";
import { topicRouter } from "../routes/topic";
import { SqlTopicMapper } from "../../adapters/repositories/mappers/SqlTopicMapper";
import { db } from "../../adapters/_test_/tools/db";
import { DataBuilders } from "../../core/tools/dataBuilders";

const app = express();

describe("E2E - topic", () => {
  let topicRepository: SqlTopicRepository;

  const topic = DataBuilders.generateTopic();
  const vote = DataBuilders.generateVote();

  beforeAll(async () => {
    app.use(express.json());
    app.use("/topics", topicRouter);

    const topicMapper = new SqlTopicMapper();

    topicRepository = new SqlTopicRepository(db, topicMapper);
  });

  afterEach(async () => {
    await db.raw(`TRUNCATE TABLE topics`);
  });

  it("POST /topics/create", async () => {
    const response = await supertest(app).post("/topics/create").send({
      voteId: vote.props.id,
      title: topic.props.title,
      description: topic.props.description,
      votes: topic.props.votes,
    });

    const responseBody = response.body;
    const responseStatus = response.status;

    expect(responseBody.id).toBeDefined();
    expect(responseBody.title).toEqual(topic.props.title);
    expect(responseBody.description).toEqual(topic.props.description);
    expect(responseBody.votes).toBeDefined();
    expect(responseBody.createdAt).toBeDefined();
    expect(responseStatus).toBe(201);
    jest.setTimeout(1000);
  });

  it("POST /topics/create should return a status 400", async () => {
    const response = await supertest(app).post("/topics/create");

    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
    jest.setTimeout(1000);
  });

  it("GET /topics/:id", async () => {
    await topicRepository.save(topic);

    const response = await supertest(app).get(`/topics/${topic.props.id}`);

    const responseBody = response.body;
    const responseStatus = response.status;

    expect(responseBody.id).toBeDefined();
    expect(responseBody.title).toEqual(topic.props.title);
    expect(responseBody.description).toEqual(topic.props.description);
    expect(responseBody.votes).toBeDefined();
    expect(responseBody.createdAt).toBeDefined();
    expect(responseStatus).toBe(200);
    jest.setTimeout(1000);
  });

  it("GET /topics/:id should return a status 400", async () => {
    const response = await supertest(app).get(`/topics/${topic.props.id}`);

    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
    jest.setTimeout(1000);
  });

  it("GET /topics/by_title/:title", async () => {
    await topicRepository.save(topic);

    const response = await supertest(app)
    .get(`/topics/by_title/${topic.props.title}`);

    const responseBody = response.body;
    const responseStatus = response.status;

    expect(responseBody.id).toBeDefined();
    expect(responseBody.title).toEqual(topic.props.title);
    expect(responseBody.description).toEqual(topic.props.description);
    expect(responseBody.votes).toBeDefined();
    expect(responseBody.createdAt).toBeDefined();
    expect(responseStatus).toBe(200);
    jest.setTimeout(1000);
  });

  it("GET /topics/by_title/:title should return a status 400", async () => {
    const response = await supertest(app)
    .get(`/topics/by_title/${topic.props.title}`);

    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
    jest.setTimeout(1000);
  });

  it("DELETE /topics/:id", async () => {
    await topicRepository.save(topic);

    const response = await supertest(app).delete(`/topics/${topic.props.id}`);

    const responseStatus = response.status;

    expect(responseStatus).toBe(202);
    jest.setTimeout(1000);
  });

  it("DELETE /topics/:id should return a status 400", async () => {
    const response = await supertest(app).delete(`/topics/${topic.props.id}`);

    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
  });
});
