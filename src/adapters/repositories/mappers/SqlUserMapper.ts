import { User } from "../../../core/entities/User";
import { UserModel } from "../models/UserModel";
import { Mapper } from "./Mapper";

export class SqlUserMapper implements Mapper<UserModel, User> {
  toDomain(raw: UserModel): User {
    const user = new User({
      id: raw.id,
      username: raw.username,
      email: raw.email,
      password: raw.password,
      createdAt: raw.created_at,
      updatedAt: raw.updated_at,
    });
    return user;
  }

  fromDomain(data: User): UserModel {
    const userModel: UserModel = {
      id: data.props.id,
      username: data.props.username,
      email: data.props.email,
      password: data.props.password,
      created_at: data.props.createdAt,
      updated_at: data.props.updatedAt,
    };
    return userModel;
  }
}
