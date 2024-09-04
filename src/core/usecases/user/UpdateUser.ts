import { User } from "../../entities/User";
import { UserErrors } from "../../errors/UserErrors";
import { UserRepositories } from "../../repositories/userRepositories";
import { Usecases } from "../useCase";

type UpdateUserInput = {
  id: string;
  newUsername: string;
};

export class UpdateUser implements Usecases<UpdateUserInput, Promise<User>> {
  constructor(private readonly _userRepository: UserRepositories) {}

  async execute(input: UpdateUserInput): Promise<User> {
    const { id, newUsername } = input;

    const user = await this._userRepository.getById(id);

    if (!user) {
      throw new UserErrors.NotFound();
    }

    user.update(newUsername);

    return user;
  }
}
