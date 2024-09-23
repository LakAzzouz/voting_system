import express from "express";
import supertest from "supertest";

import { SqlUserRepository } from "../../adapters/repositories/SQL/SqlUserRepository";
import { userRouteur } from "../routes/user";
import { SqlUserMapper } from "../../adapters/repositories/mappers/SqlUserMapper";
import { db } from "../../adapters/_test_/tools/db";
import { DataBuilders } from "../../core/tools/dataBuilders";

const app = express();

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
    //await db.raw(`TRUNCATE TABLE users`);
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
});
