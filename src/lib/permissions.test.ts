import { describe, it, expect } from 'vitest';
import { hasPermission, isSuperAdmin, ALL_ROLES, PERMISSION_GROUPS } from './permissions';
import type { User } from '@/types/auth';

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    name: 'Test',
    email: 'test@test.com',
    phone: null,
    type: 'admin',
    status: 'active',
    locale: 'en',
    last_active_at: null,
    roles: [{ id: 1, name: 'admin' }],
    permissions: ['list-users', 'show-user'],
    ...overrides,
  };
}

describe('hasPermission', () => {
  it('returns false for null user', () => {
    expect(hasPermission(null, 'list-users')).toBe(false);
  });

  it('returns false for customer user type', () => {
    const customer = makeUser({ type: 'customer', permissions: ['list-users'] });
    expect(hasPermission(customer, 'list-users')).toBe(false);
  });

  it('returns true for super-admin regardless of permissions array', () => {
    const superAdmin = makeUser({
      roles: [{ id: 1, name: 'super-admin' }],
      permissions: [],
    });
    expect(hasPermission(superAdmin, 'manage-settings')).toBe(true);
  });

  it('returns true when user has the permission', () => {
    const admin = makeUser({ permissions: ['list-users', 'create-user'] });
    expect(hasPermission(admin, 'create-user')).toBe(true);
  });

  it('returns false when user lacks the permission', () => {
    const admin = makeUser({ permissions: ['list-users'] });
    expect(hasPermission(admin, 'delete-role')).toBe(false);
  });

  it('returns false for admin with empty permissions', () => {
    const admin = makeUser({ permissions: [] });
    expect(hasPermission(admin, 'list-users')).toBe(false);
  });
});

describe('isSuperAdmin', () => {
  it('returns false for null user', () => {
    expect(isSuperAdmin(null)).toBe(false);
  });

  it('returns true for user with super-admin role', () => {
    const superAdmin = makeUser({ roles: [{ id: 1, name: 'super-admin' }] });
    expect(isSuperAdmin(superAdmin)).toBe(true);
  });

  it('returns false for regular admin', () => {
    const admin = makeUser({ roles: [{ id: 2, name: 'admin' }] });
    expect(isSuperAdmin(admin)).toBe(false);
  });

  it('returns true when super-admin is one of multiple roles', () => {
    const user = makeUser({
      roles: [
        { id: 1, name: 'admin' },
        { id: 2, name: 'super-admin' },
      ],
    });
    expect(isSuperAdmin(user)).toBe(true);
  });

  it('returns false for customer', () => {
    const customer = makeUser({ type: 'customer', roles: [{ id: 3, name: 'customer' }] });
    expect(isSuperAdmin(customer)).toBe(false);
  });
});

describe('ALL_ROLES', () => {
  it('contains 4 roles', () => {
    expect(ALL_ROLES).toHaveLength(4);
  });

  it('includes super-admin, admin, finance-admin, customer', () => {
    const names = ALL_ROLES.map((r) => r.name);
    expect(names).toEqual(['super-admin', 'admin', 'finance-admin', 'customer']);
  });
});

describe('PERMISSION_GROUPS', () => {
  it('contains 11 groups', () => {
    expect(PERMISSION_GROUPS).toHaveLength(11);
  });

  it('has unique domain names', () => {
    const domains = PERMISSION_GROUPS.map((g) => g.domain);
    expect(new Set(domains).size).toBe(domains.length);
  });

  it('each group has at least one permission', () => {
    for (const group of PERMISSION_GROUPS) {
      expect(group.permissions.length).toBeGreaterThan(0);
    }
  });

  it('all permissions have key, label, and description', () => {
    for (const group of PERMISSION_GROUPS) {
      for (const perm of group.permissions) {
        expect(perm.key).toBeTruthy();
        expect(perm.label).toBeTruthy();
        expect(perm.description).toBeTruthy();
      }
    }
  });
});
