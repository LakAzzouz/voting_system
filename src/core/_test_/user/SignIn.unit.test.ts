import { MockPasswordGateway } from "../../adapters/gateways/MockPasswordGateway";
import { InMemoryUserRepository } from "../../adapters/repositories/InMemoryUserRepositories";
import { User } from "../../entities/User";
import { UserErrors } from "../../errors/UserErrors";
import { DataBuilders } from "../../tools/dataBuilders";
import { SignIn } from "../../usecases/user/SignIn";

describe("Unit - sign in", () => {
  let signIn: SignIn;
  const userDb = new Map<string, User>();
  const user = DataBuilders.generateUser({});

  beforeAll(async () => {
    const userRepository = new InMemoryUserRepository(userDb);
    const passwordGateway = new MockPasswordGateway();
    signIn = new SignIn(userRepository, passwordGateway);
  });

  afterEach(async () => {
    userDb.clear();
  });

  it("Should sign in", async () => {
    userDb.set(user.props.id, user);

    const result = await signIn.execute({
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

  it("Should throw an error because email is not found", async () => {
    userDb.set(user.props.id, user);

    const result = signIn.execute({
      email: "wrong_email",
      password: user.props.password,
    });

    await expect(result).rejects.toThrow(UserErrors.EmailNotFound);
  });

  it("Should throw an error because the password is not matching", async () => {
    userDb.set(user.props.id, user);

    const result = signIn.execute({
      email: user.props.email,
      password: "wrong_password",
    });

    await expect(result).rejects.toThrow(UserErrors.InvalidPassword);
  });
});
