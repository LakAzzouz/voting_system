import express from "express";

import { SignInCommand, UpdateUserCommand, UserCreateCommand } from "../validation/userCommands";
import { CreateUser } from "../../core/usecases/user/CreateUser";
import { SqlUserRepository } from "../../adapters/repositories/SQL/SqlUserRepository";
import { db } from "../../adapters/_test_/tools/db";
import { SqlUserMapper } from "../../adapters/repositories/mappers/SqlUserMapper";
import { MockPasswordGateway } from "../../core/adapters/gateways/MockPasswordGateway";
import { SignIn } from "../../core/usecases/user/SignIn";
import { GetUserById } from "../../core/usecases/user/GetUserById";
import { GetUserByEMail } from "../../core/usecases/user/GetUserByEmail";
import { UpdateUser } from "../../core/usecases/user/UpdateUser";
import { DeleteUser } from "../../core/usecases/user/DeleteUser";
import { Auth, RequestAuth } from "../../adapters/_test_/middleware/auth";

export const userRouteur = express.Router();

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET

const userMapper = new SqlUserMapper();
const passwordGateway = new MockPasswordGateway();

const userRepository = new SqlUserRepository(db, userMapper);

const createUser = new CreateUser(userRepository, passwordGateway);
const signIn = new SignIn(userRepository, passwordGateway);
const getUserById = new GetUserById(userRepository);
const getUserByEmail = new GetUserByEMail(userRepository);
const updateUser = new UpdateUser(userRepository);
const deleteUser = new DeleteUser(userRepository);

userRouteur.post("/create", async (req: express.Request, res: express.Response) => {
    try {
      const { username, email, password } = UserCreateCommand.validateUserCreate(req.body);

      const user = await createUser.execute({
        username,
        email,
        password,
      });

      const result = {
        id: user.props.id,
        username: user.props.username,
        email: user.props.email,
        password: user.props.password,
        createdAt: user.props.createdAt,
      };

      return res.status(201).send(result);
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).send(error.message);
      }
    }
  }
);

userRouteur.post("/sign_in", async (req: express.Request, res: express.Response) => {
    try {
      const { email, password } = SignInCommand.validateSignIn(req.body);

      const user = await signIn.execute({
        email,
        password,
      });

      const token = jwt.sign({
        id: user.props.id,
        email: user.props.email
      }, jwtSecret)

      const result = {
        id: user.props.id,
        username: user.props.username,
        email: user.props.email,
        token
      };

      return res.status(201).send(result);
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).send(error.message);
      }
    }
  }
);

userRouteur.use(Auth)
userRouteur.get("/by_id", async (req: express.Request, res: express.Response) => {
  try {
    const authRequest = req as RequestAuth;

    const user = await getUserById.execute({
      id: authRequest.user.id,
    });

    const result = {
      id: user.props.id,
      username: user.props.username,
      email: user.props.email,
      password: user.props.password,
      createdAt: user.props.createdAt,
    };

    return res.status(200).send(result);
  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
  }
});

userRouteur.get("/by_email", async (req: express.Request, res: express.Response) => {
    try {
      const authRequest = req as RequestAuth;

      const user = await getUserByEmail.execute({
        email: authRequest.user.email,
      });

      const result = {
        id: user.props.id,
        username: user.props.username,
        email: user.props.email,
        password: user.props.password,
      };

      return res.status(200).send(result);
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).send(error.message);
      }
    }
  }
);

userRouteur.patch("/update", async (req: express.Request, res: express.Response) => {
    try {
      const authRequest = req as RequestAuth;

      const { newUsername } = UpdateUserCommand.validateUpdateUser(req.body);

      const user = await updateUser.execute({
        id: authRequest.user.id,
        newUsername,
      });

      const result = {
        id: user.props.id,
        newUsername,
      };

      return res.status(201).send(result);
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).send(error.message);
      }
    }
  }
);

userRouteur.delete("/delete", async (req: express.Request, res: express.Response) => {
    try {
      const authRequest = req as RequestAuth;

      await deleteUser.execute({
        id: authRequest.user.id,
      });

      return res.sendStatus(202);
    } catch (error: any) {
      if (error instanceof Error) {
        return res.status(400).send(error.message);
      }
    }
  }
);
