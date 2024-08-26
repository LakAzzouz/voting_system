import { InMemoryUserRepository } from "../../adapters/repositories/InMemoryUserRepositories";
import { User } from "../../entities/User";
import { UserErrors } from "../../errors/UserErrors";
import { DataBuilders } from "../../tools/dataBuilders";
import { GetUserByEMail } from "../../usecases/user/GetUserByEmail";

describe("Unit - get user by email", () => {
  let getUserByEmail: GetUserByEMail;
  const userDb = new Map<string, User>();
  const user = DataBuilders.generateUser();

  beforeAll(async () => {
    const userRepository = new InMemoryUserRepository(userDb);
    getUserByEmail = new GetUserByEMail(userRepository);
  });

  afterEach(async () => {
    userDb.clear();
  });

  it("Should get user by email", async () => {
    userDb.set(user.props.id, user);

    const result = await getUserByEmail.execute({
      email: user.props.email,
    });

    expect(result.props.id).toBeDefined();
    expect(result.props.username).toEqual(user.props.username);
    expect(result.props.email).toEqual(user.props.email);
    expect(result.props.password).toEqual(user.props.password);
    expect(result.props.createdAt).toBeDefined();
    expect(result.props.updatedAt).toBeDefined();
  });

  it("Should throw an error because email is not found", async () => {
    userDb.set(user.props.id, user);

    const result = getUserByEmail.execute({
      email: "wrong_email",
    });

    await expect(result).rejects.toThrow(UserErrors.EmailNotFound);
  });
});
