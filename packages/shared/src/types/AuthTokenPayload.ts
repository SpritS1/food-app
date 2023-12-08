import { AccountType } from "../types";

export default interface AuthTokenPayload {
  email: string;
  accountType: AccountType;
}
