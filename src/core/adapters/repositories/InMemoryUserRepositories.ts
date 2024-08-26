import { User } from "../../entities/User";
import { UserRepositories } from "../../repositories/userRepositories";

export class InMemoryUserRepository implements UserRepositories {
  map: Map<string, User>;

  constructor(map: Map<string, User>) {
    this.map = map;
  }

  async save(user: User): Promise<void> {
    this.map.set(user.props.id, user);
    return;
  }

  async getById(id: string): Promise<User | null> {
    const user = this.map.get(id);
    if (!user) {
      return null;
    }
    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const arr = Array.from(this.map.values());
    const user = arr.find((elm) => elm.props.email === email);
    if (!user) {
      return null;
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    this.map.delete(id);
    return;
  }
}
