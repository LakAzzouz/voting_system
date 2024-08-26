import { User } from "../entities/User";

export interface UserRepositories {
  save(user: User): Promise<void>;

  getById(id: string): Promise<User | null>;

  getByEmail(email: string): Promise<User | null>;

  delete(id: string): Promise<void>;
}
