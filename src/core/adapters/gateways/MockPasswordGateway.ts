import { PasswordGateway } from "../../gateways/PasswordGateways";

export class MockPasswordGateway implements PasswordGateway {
  hashPassword(password: string): string {
    return password;
  }

  compare(password: string, hashedPassword: string): boolean {
    return password === hashedPassword;
  }
}
