import { UserErrors } from "../../errors/UserErrors";
import { UserRepositories } from "../../repositories/userRepositories";
import { Usecases } from "../useCase";

type DeleteUserInput = {
  id: string;
};

export class DeleteUser implements Usecases<DeleteUserInput, Promise<void>> {
  constructor(private readonly _userRepository: UserRepositories) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const { id } = input;

    const user = await this._userRepository.getById(id);

    if (!user) {
      throw new UserErrors.UserNotFound();
    }

    await this._userRepository.delete(id);

    return;
  }
}
