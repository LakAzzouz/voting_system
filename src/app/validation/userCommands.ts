import { z } from "zod";

export const userCreateSchema = z.object({
  email: z.string(),
  username: z.string(),
  password: z.string(),
});

type UserCreateSchema = z.infer<typeof userCreateSchema>;

export class UserCreateCommand {
  static validateUserCreate(body: any): UserCreateSchema {
    const validation = userCreateSchema.safeParse(body);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }
    return validation.data;
  }
}

export const signInSchema = z.object({
  email: z.string(),
  password: z.string(),
});

type SignInSchema = z.infer<typeof signInSchema>;

export class SignInCommand {
  static validateSignIn(body: any): SignInSchema {
    const validation = signInSchema.safeParse(body);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }
    return validation.data;
  }
}

export const updateUserSchema = z.object({
  newUsername: z.string(),
});

type UpdateUserSchema = z.infer<typeof updateUserSchema>;

export class UpdateUserCommand {
  static validateUpdateUser(body: any): UpdateUserSchema {
    const validation = updateUserSchema.safeParse(body);
    if (!validation.success) {
      throw new Error(validation.error.message);
    }
    return validation.data;
  }
}
