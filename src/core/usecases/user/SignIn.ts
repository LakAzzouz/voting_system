import { User } from "../../entities/User";
import { UserErrors } from "../../errors/UserErrors";
import { PasswordGateway } from "../../gateways/PasswordGateways";
import { UserRepositories } from "../../repositories/userRepositories";
import { Usecases } from "../useCase";

type SignInInput = {
  email: string;
  password: string;
};

export class SignIn implements Usecases<SignInInput, Promise<User>> {
  constructor(
    private readonly _userRepository: UserRepositories,
    private readonly _passwordGateway: PasswordGateway
  ) {}

  async execute(input: SignInInput): Promise<User> {
    const { email, password } = input;

    const user = await this._userRepository.getByEmail(email);

    if (!user) {
      throw new UserErrors.EmailNotFound();
    }

    const isMatching = this._passwordGateway.compare(password, user.props.password);

    if (!isMatching) {
      throw new UserErrors.InvalidPassword();
    }

    return user;
  }
}
