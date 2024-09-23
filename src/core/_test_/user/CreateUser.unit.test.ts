import { MockPasswordGateway } from "../../adapters/gateways/MockPasswordGateway";
import { InMemoryUserRepository } from "../../adapters/repositories/InMemoryUserRepositories";
import { User } from "../../entities/User";
import { UserErrors } from "../../errors/UserErrors";
import { DataBuilders } from "../../tools/dataBuilders";
import { CreateUser } from "../../usecases/user/CreateUser";

describe("Unit - create user", () => {
  let createUser: CreateUser;
  const userDb = new Map<string, User>();
  const user = DataBuilders.generateUser();

  beforeAll(async () => {
    const userRepository = new InMemoryUserRepository(userDb);
    const passwordGateway = new MockPasswordGateway();
    createUser = new CreateUser(userRepository, passwordGateway);
  });

  afterEach(async () => {
    userDb.clear();
  });

  it("Should create a user", async () => {
    const result = await createUser.execute({
      username: user.props.username,
      email: user.props.email,
      password: user.props.password,
    });

    expect(result.props.id).toBeDefined();
    expect(result.props.username).toEqual(user.props.username);
    expect(result.props.email).toEqual(user.props.email);
    expect(result.props.password).toEqual(user.props.password);
    expect(result.props.createdAt).toBeDefined();
    expect(result.props.updatedAt).toBeDefined();
  });

  it("Should throw an error because email is not valid", async () => {
    const result = createUser.execute({
      username: user.props.username,
      email: "email_not_valid",
      password: user.props.password
    });

    await expect(result).rejects.toThrow(UserErrors.InvalidEmail);
  })

  it("Should throw an error because password is not valid", async () => {
    const result = createUser.execute({
      username: user.props.username,
      email: user.props.email,
      password: "password_not_valid",
    });

    await expect(result).rejects.toThrow(UserErrors.InvalidPassword);
  });

  it("Should throw an error because the email already exist", async () => {
    userDb.set(user.props.id, user);

    const result = createUser.execute({
      username: user.props.username,
      email: user.props.email,
      password: user.props.password,
    });

    await expect(result).rejects.toThrow(UserErrors.AlreadyExist);
  });
});
