import type { Role } from './auth';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  type: 'customer' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  locale: 'en' | 'de' | 'fr';
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
  roles: Role[];
  permissions: string[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  type: 'customer' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  locale: 'en' | 'de' | 'fr';
  roles?: string[];
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  phone?: string | null;
  type?: 'customer' | 'admin';
  status?: 'active' | 'inactive' | 'suspended';
  locale?: 'en' | 'de' | 'fr';
  roles?: string[];
  permissions?: string[];
}

export interface UserListParams {
  page?: number;
  search?: string;
  status?: string;
  type?: string;
  role?: string;
  per_page?: number;
}

export interface AdminRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions?: { id: number; name: string }[];
  users_count?: number;
}

export interface CreateRoleRequest {
  name: string;
  permissions?: string[];
}

export interface UpdateRoleRequest {
  name?: string;
  permissions?: string[];
}

export interface AdminPermission {
  id: number;
  name: string;
  guard_name: string;
}

export interface PermissionDefinition {
  key: string;
  label: string;
  description: string;
}

export interface PermissionGroup {
  domain: string;
  label: string;
  permissions: PermissionDefinition[];
}
