export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "member";
}
