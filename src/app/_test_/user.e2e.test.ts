import express from "express";
import supertest from "supertest";

import { SqlUserRepository } from "../../adapters/repositories/SQL/SqlUserRepository";
import { userRouteur } from "../routes/user";
import { SqlUserMapper } from "../../adapters/repositories/mappers/SqlUserMapper";
import { db } from "../../adapters/_test_/tools/db";
import { DataBuilders } from "../../core/tools/dataBuilders";

const app = express();
const { sign } = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

describe("E2E - user", () => {
  let userRepository: SqlUserRepository;
  let authorization;

  const user = DataBuilders.generateUser();

  beforeAll(async () => {
    app.use(express.json());
    app.use("/users", userRouteur);

    const userMapper = new SqlUserMapper();
    userRepository = new SqlUserRepository(db, userMapper);
  });

  afterEach(async () => {
    await db.raw(`TRUNCATE TABLE users`);
  });

  it("POST /users/create", async () => {
    const response = await supertest(app).post("/users/create").send({
      username: user.props.username,
      email: user.props.email,
      password: user.props.password,
    });

    const responseBody = response.body;
    const responseStatus = response.status;

    expect(responseBody.id).toBeDefined();
    expect(responseBody.username).toEqual(user.props.username);
    expect(responseBody.email).toEqual(user.props.email);
    expect(responseBody.password).toEqual(user.props.password);
    expect(responseBody.createdAt).toBeDefined();
    expect(responseStatus).toBe(201);
    jest.setTimeout(1000);
  });

  it("POST /users/create should return a status 400", async () => {
    const response = await supertest(app).post("/users/create");

    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
    jest.setTimeout(1000);
  });

  it("POST /users/sign_in", async () => {
    await userRepository.save(user);

    const response = await supertest(app).post("/users/sign_in").send({
      email: user.props.email,
      password: user.props.password,
    });

    const responseBody = response.body;
    const responseStatus = response.status;

    expect(responseBody.id).toBeDefined();
    expect(responseBody.username).toEqual(user.props.username);
    expect(responseBody.email).toEqual(user.props.email);
    expect(responseBody.token).toBeDefined();
    expect(responseStatus).toBe(201);
    jest.setTimeout(1000);
  });

  it("POST /users/sign_in should return a status 400", async () => {
    const response = await supertest(app).post("/users/sign_in");

    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
  });

  it("GET /users/by_id", async () => {
    await userRepository.save(user);

    authorization = sign(
      {
        id: user.props.id,
        email: user.props.email,
      },
      jwtSecret
    );

    const response = await supertest(app)
      .get("/users/by_id")
      .set("authorization", authorization);

    const responseBody = response.body;
    const responseStatus = response.status;

    expect(responseBody.id).toBeDefined();
    expect(responseBody.username).toEqual(user.props.username);
    expect(responseBody.email).toEqual(user.props.email);
    expect(responseBody.password).toEqual(user.props.password);
    expect(responseBody.createdAt).toBeDefined();
    expect(responseStatus).toBe(200);
    jest.setTimeout(1000);
  });

  it("GET /users/by_id should return a status 400", async () => {
    authorization = sign(
      {
        id: "",
        email: "",
      },
      jwtSecret
    );

    const response = await supertest(app)
      .get("/users/by_id")
      .set("authorization", authorization);

    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
    jest.setTimeout(1000);
  });

  it("GET /users/by_email", async () => {
    await userRepository.save(user);

    authorization = sign(
      {
        id: user.props.id,
        email: user.props.email,
      },
      jwtSecret
    );

    const response = await supertest(app)
      .get("/users/by_email")
      .set("authorization", authorization);

    const responseBody = response.body;
    const responseStatus = response.status;

    expect(responseBody.id).toBeDefined();
    expect(responseBody.username).toEqual(user.props.username);
    expect(responseBody.email).toEqual(user.props.email);
    expect(responseBody.password).toEqual(user.props.password);
    expect(responseStatus).toBe(200);
    jest.setTimeout(1000);
  });

  it("GET /users/by_email should return a status 400", async () => {
    authorization = sign(
      {
        id: "",
        email: "",
      },
      jwtSecret
    );

    const response = await supertest(app)
      .get("/users/by_email")
      .set("authorization", authorization);

    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
    jest.setTimeout(1000);
  });

  it("/users/update", async () => {
    await userRepository.save(user);

    authorization = sign(
      {
        id: user.props.id,
        email: user.props.email,
      },
      jwtSecret
    );

    const response = await supertest(app)
      .patch("/users/update")
      .set("authorization", authorization)
      .send({
        newUsername: user.props.username,
      });

    const responseBody = response.body;
    const responseStatus = response.status;

    expect(responseBody.id).toBeDefined();
    expect(responseBody.newUsername).toEqual(user.props.username);
    expect(responseStatus).toBe(201);
    jest.setTimeout(1000);
  });

  it("/users/update should return a status 400", async () => {
    authorization = sign(
      {
        id: "",
        email: "",
      },
      jwtSecret
    );

    const response = await supertest(app)
      .patch("/users/update")
      .set("authorization", authorization);

    const responseStatus = response.status;

    expect(responseStatus).toBe(400);
    jest.setTimeout(1000);
  });

  it("/users/delete", async () => {
    await userRepository.save(user);

    authorization = sign(
      {
        id: user.props.id,
        email: user.props.email,
      },
      jwtSecret
    );

    const response = await supertest(app)
      .delete("/users/delete")
      .set("authorization", authorization);

    const responseStatus = response.status;

    expect(responseStatus).toBe(202);
    jest.setTimeout(1000);
  });

  it("/users/delete should return a status 400", async () => {
    authorization = sign(
      {
        id: "",
        email: "",
      },
      jwtSecret
    );

    const response = await supertest(app)
      .delete("/users/delete")
      .set("authorization", authorization);

      const responseStatus = response.status;

      expect(responseStatus).toBe(400);
    });
});
