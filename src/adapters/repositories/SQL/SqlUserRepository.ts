import { Knex } from "knex";
import { UserRepositories } from "../../../core/repositories/userRepositories";
import { SqlUserMapper } from "../mappers/SqlUserMapper";
import { User } from "../../../core/entities/User";

export class SqlUserRepository implements UserRepositories {
  constructor(
    private readonly _knex: Knex,
    private readonly _userMapper: SqlUserMapper
  ) {}

  async save(user: User): Promise<void> {
    const userModel = this._userMapper.fromDomain(user);
    await this._knex.raw(
      `INSERT INTO users (id, username, email, password, created_at, updated_at)
      VALUES (:id, :username, :email, :password, :created_at, :updated_at)`,
      {
        id: userModel.id,
        username: userModel.username,
        email: userModel.email,
        password: userModel.password,
        created_at: userModel.created_at,
        updated_at: userModel.updated_at,
      }
    );

    return;
  }

  async getById(id: string): Promise<User | null> {
    const userModel = await this._knex.raw(
      `SELECT *
      FROM users
      WHERE id = :id`,
      {
        id: id,
      }
    );

    const user = this._userMapper.toDomain(userModel[0][0]);

    return user;
  }

  async getByEmail(email: string): Promise<User | null> {
    const userModel = await this._knex.raw(
      `SELECT *
      FROM users
      WHERE email = :email`,
      {
        email: email,
      }
    );

    if(!userModel[0][0]) {
      return null
    }

    const user = this._userMapper.toDomain(userModel[0][0]);

    return user;
  }

  async delete(id: string): Promise<void> {
    await this._knex.raw(
      `DELETE
        FROM users
        WHERE id = :id`,
      {
        id: id,
      }
    );

    return;
  }
}
