import { AccountType } from "../types";

export default interface AuthTokenPayload {
  userId: string;
  email: string;
  accountType: AccountType;
}