import knex from "knex";
import { DataBuilders } from "../../../core/tools/dataBuilders";
import { SqlUserRepository } from "../../repositories/SQL/SqlUserRepository";
import { SqlUserMapper } from "../../repositories/mappers/SqlUserMapper";
import { db } from "../tools/db";

describe("Integ - sql user repository", () => {
  let sqlUserMapper: SqlUserMapper;
  let sqlUserRepository: SqlUserRepository;
  const user = DataBuilders.generateUser();

  beforeAll(async () => {
    sqlUserMapper = new SqlUserMapper();
    sqlUserRepository = new SqlUserRepository(db, sqlUserMapper);
  });

  afterEach(async () => {
    await db.raw(`TRUNCATE TABLE users`);
  });

  it("Should save user and get it by id", async () => {
    await sqlUserRepository.save(user);

    const result = await sqlUserRepository.getById(user.props.id);

    expect(result?.props.id).toBeDefined();
    expect(result?.props.username).toEqual(user.props.username);
    expect(result?.props.email).toEqual(user.props.email);
    expect(result?.props.password).toEqual(user.props.password);
    expect(result?.props.createdAt).toBeDefined();
    expect(result?.props.updatedAt).toBeDefined();
  });

  it("Should return null because user is not found", async () => {
    await sqlUserRepository.save(user);

    const result = sqlUserRepository.getById("wrong_id");

    expect(result).toBeUndefined();
  });
});
