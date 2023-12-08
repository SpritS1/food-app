export type AccountType = "regular" | "business";

// export interface ApiResponse<T = any> {
//   message: string;
//   data?: T;
//   error?: string;
// }

export interface AuthResponse {
  accessToken: string;
}
