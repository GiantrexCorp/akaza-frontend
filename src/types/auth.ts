export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  type: 'customer' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  locale: 'en' | 'de' | 'fr';
  last_active_at: string | null;
  roles: Role[];
  permissions: string[];
}

export interface Role {
  id: number;
  name: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  token_type: 'Bearer';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  locale?: 'en' | 'de' | 'fr';
}
