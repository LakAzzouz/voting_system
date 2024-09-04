import { User } from "../../entities/User";
import { UserErrors } from "../../errors/UserErrors";
import { UserRepositories } from "../../repositories/userRepositories";
import { Usecases } from "../useCase";

type GetUserByIdInput = {
  id: string;
};

export class GetUserById implements Usecases<GetUserByIdInput, Promise<User>> {
  constructor(private readonly _userRepository: UserRepositories) {}

  async execute(input: GetUserByIdInput): Promise<User> {
    const { id } = input;

    const user = await this._userRepository.getById(id);

    if (!user) {
      throw new UserErrors.NotFound();
    }

    return user;
  }
}
