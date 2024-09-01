import knex from "knex";
import { DataBuilders } from "../../../core/tools/dataBuilders";
import { SqlVoteRepository } from "../../repositories/SQL/SqlVoteRepository";
import { SqlVoteMapper } from "../../repositories/mappers/SqlVoteMapper";
import { db } from "../tools/db";

describe("Integ - sql vote repository", () => {
  let sqlVoteRepository: SqlVoteRepository;
  let sqlVoteMapper: SqlVoteMapper;
  const vote = DataBuilders.generateVote();

  beforeAll(async () => {
    sqlVoteMapper = new SqlVoteMapper();
    sqlVoteRepository = new SqlVoteRepository(db, sqlVoteMapper);
  });

  afterEach(async () => {
    await db.raw(`TRUNCATE TABLE votes`);
  });

  it("Should save a vote and get it by id", async () => {
    await sqlVoteRepository.save(vote);

    const result = await sqlVoteRepository.getById(vote.props.id);

    expect(result?.props.id).toBeDefined();
    expect(result?.props.userId).toBeDefined();
    expect(result?.props.topicId).toBeDefined();
    expect(result?.props.answer).toEqual(0 || 1);
    expect(result?.props.createdAt).toBeDefined();
  });

  it("Should get vote by user id", async () => {
    await sqlVoteRepository.save(vote);

    const result = await sqlVoteRepository.getByUserId(vote.props.userId);

    expect(result?.props.id).toBeDefined();
    expect(result?.props.userId).toBeDefined();
    expect(result?.props.topicId).toBeDefined();
    expect(result?.props.answer).toEqual(0 || 1);
    expect(result?.props.createdAt).toBeDefined();
  });

  it("Should delete vote", async () => {
    await sqlVoteRepository.save(vote);

    const result = await sqlVoteRepository.delete(vote.props.id);

    expect(result).toBeUndefined();
  });
});
