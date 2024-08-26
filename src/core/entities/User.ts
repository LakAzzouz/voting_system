import { v4 } from "uuid";

type UserProperties = {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt?: Date;
};

export class User {
  props: UserProperties;

  constructor(userProperties: UserProperties) {
    this.props = userProperties;
  }

  static create(props: {username: string, email: string, password: string}): User {
    const user = new User({
      id: v4(),
      username: props.username,
      email: props.email,
      password: props.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return user;
  }

  update(newUsername: string): User {
    this.props.username = newUsername
    return this;
  }
}
