import { AccountType } from "../types";

export interface RegisterDTO {
  email: string;
  password: string;
  accountType: AccountType;
}
