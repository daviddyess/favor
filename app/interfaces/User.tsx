export interface UserInput {
  id?: string | null;
  createdAt?: string;
  username: string;
}

export interface User {
  id?: string | null | undefined;
  createdAt?: string;
  updatedAt?: string;
  username?: string;
  image?: string;
  avatar?: { sm?: string | null; md?: string | null; lg?: string | null };
  email?: string;
  isLoggedIn?: boolean;
}

export type UserLogin = {
  email: string;
  password: string;
};
