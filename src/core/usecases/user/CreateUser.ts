import { User } from "../../entities/User";
import { UserErrors } from "../../errors/UserErrors";
import { PasswordGateway } from "../../gateways/PasswordGateways";
import { UserRepositories } from "../../repositories/userRepositories";
import { Email } from "../../valuesObject/emailValidated";
import { Password } from "../../valuesObject/passwordValidated";
import { Usecases } from "../useCase";

type CreateUserInput = {
  username: string;
  email: string;
  password: string;
};

export class CreateUser implements Usecases<CreateUserInput, Promise<User>> {
  constructor(
    private readonly _userRepository: UserRepositories,
    private readonly _passwordGateway: PasswordGateway
  ) {}

  async execute(input: CreateUserInput): Promise<User> {
    const { username, email, password } = input;

    const emailValidated = Email.validate(email);

    const userAlreadyExist = await this._userRepository.getByEmail(emailValidated);

    if (userAlreadyExist) {
      throw new UserErrors.AlreadyExist();
    }

    const passwordValidated = Password.validate(password);

    const hashedPassword = this._passwordGateway.hashPassword(passwordValidated);

    const user = User.create({
      username,
      email,
      password: hashedPassword,
    });

    await this._userRepository.save(user);

    return user;
  }
}
