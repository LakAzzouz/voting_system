import { InMemoryUserRepository } from "../../adapters/repositories/InMemoryUserRepositories";
import { User } from "../../entities/User";
import { UserErrors } from "../../errors/UserErrors";
import { DataBuilders } from "../../tools/dataBuilders";
import { UpdateUser } from "../../usecases/user/UpdateUser";

describe("Unit - update user", () => {
  let updateUser: UpdateUser;
  const userDb = new Map<string, User>();
  const user = DataBuilders.generateUser();

  beforeAll(async () => {
    const userRepository = new InMemoryUserRepository(userDb);
    updateUser = new UpdateUser(userRepository);
  });

  afterEach(async () => {
    userDb.clear();
  });

  it("Should update user", async () => {
    userDb.set(user.props.id, user);

    const result = await updateUser.execute({
      id: user.props.id,
      newUsername: user.props.username,
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

    const result = updateUser.execute({
      id: "wrong_id",
      newUsername: user.props.username,
    });

    await expect(result).rejects.toThrow(UserErrors.UserNotFound);
  });
});
