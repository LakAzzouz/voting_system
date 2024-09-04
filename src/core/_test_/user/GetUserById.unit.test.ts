import { InMemoryUserRepository } from "../../adapters/repositories/InMemoryUserRepositories";
import { User } from "../../entities/User";
import { UserErrors } from "../../errors/UserErrors";
import { DataBuilders } from "../../tools/dataBuilders";
import { GetUserById } from "../../usecases/user/GetUserById";

describe("Unit - get user by id", () => {
  let getUserById: GetUserById;
  const userDb = new Map<string, User>();
  const user = DataBuilders.generateUser();

  beforeAll(async () => {
    const userRepository = new InMemoryUserRepository(userDb);
    getUserById = new GetUserById(userRepository);
  });

  afterEach(async () => {
    userDb.clear();
  });

  it("Should get user by id", async () => {
    userDb.set(user.props.id, user);

    const result = await getUserById.execute({
      id: user.props.id,
    });

    expect(result.props.id).toBeDefined();
    expect(result.props.username).toEqual(user.props.username);
    expect(result.props.email).toEqual(user.props.email);
    expect(result.props.password).toEqual(user.props.password);
    expect(result.props.createdAt).toBeDefined();
    expect(result.props.updatedAt).toBeDefined();
  });

  it("Should throw an error because user is not found", async () => {
    userDb.set(user.props.id, user);

    const result = getUserById.execute({
      id: "wrong_id",
    });

    await expect(result).rejects.toThrow(UserErrors.NotFound);
  });
});
