import { AccountType } from "../types";
export interface LoginDTO {
    email: string;
    password: string;
    accountType: AccountType;
}
