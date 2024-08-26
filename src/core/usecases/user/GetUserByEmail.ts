import { User } from "../../entities/User";
import { UserErrors } from "../../errors/UserErrors";
import { UserRepositories } from "../../repositories/userRepositories";
import { Usecases } from "../useCase";

type GetUserByEmailInput = {
  email: string;
};

export class GetUserByEMail implements Usecases<GetUserByEmailInput, Promise<User>> {
  constructor(private readonly _userRepository: UserRepositories) {}

  async execute(input: GetUserByEmailInput): Promise<User> {
    const { email } = input;

    const user = await this._userRepository.getByEmail(email);

    if (!user) {
      throw new UserErrors.EmailNotFound();
    }

    return user;
  }
}
