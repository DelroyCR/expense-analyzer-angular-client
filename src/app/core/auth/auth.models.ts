export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message?: string;
}

export interface RegisterResponse {
  message?: string;
  userId?: string;
  email?: string;
}

export interface CurrentUserResponse {
  userId: string;
  email: string;
  isAuthenticated: boolean;
}