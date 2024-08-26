import { InMemoryUserRepository } from "../../adapters/repositories/InMemoryUserRepositories";
import { User } from "../../entities/User";
import { DataBuilders } from "../../tools/dataBuilders";
import { DeleteUser } from "../../usecases/user/DeleteUser";

describe("Unit - delete user", () => {
  let deleteUser: DeleteUser;
  const userDb = new Map<string, User>();
  const user = DataBuilders.generateUser();

  beforeAll(async () => {
    const userRepository = new InMemoryUserRepository(userDb);
    deleteUser = new DeleteUser(userRepository);
  });

  afterEach(async () => {
    userDb.clear();
  });

  it("Should delete user", async () => {
    userDb.set(user.props.id, user);

    const result = await deleteUser.execute({
      id: user.props.id,
    });

    userDb.get(user.props.id);

    expect(result).toBeUndefined();
  });

  it("Should throw an error because user is not found", async () => {
    userDb.set(user.props.id, user);

    const result = deleteUser.execute({
      id: "wrong_id",
    });

    await expect(result).rejects.toThrow();
  });
});
