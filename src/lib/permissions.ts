import type { PermissionGroup } from '@/types/admin';
import type { User } from '@/types/auth';

export const ALL_ROLES = [
  { name: 'super-admin', label: 'Super Admin', description: 'Full unrestricted access to everything' },
  { name: 'admin', label: 'Admin', description: 'Manage users, bookings, and content' },
  { name: 'finance-admin', label: 'Finance Admin', description: 'Access financial reports and billing' },
  { name: 'customer', label: 'Customer', description: 'Standard customer account' },
] as const;

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    domain: 'users',
    label: 'User Management',
    permissions: [
      { key: 'users.view', label: 'View Users', description: 'View the user list and profiles' },
      { key: 'users.create', label: 'Create Users', description: 'Create new user accounts' },
      { key: 'users.update', label: 'Update Users', description: 'Edit user information and status' },
      { key: 'users.delete', label: 'Delete Users', description: 'Permanently remove user accounts' },
      { key: 'users.assign-roles', label: 'Assign Roles', description: 'Change user roles' },
      { key: 'users.assign-permissions', label: 'Assign Permissions', description: 'Grant or revoke individual permissions' },
    ],
  },
  {
    domain: 'hotels',
    label: 'Hotel Management',
    permissions: [
      { key: 'hotels.view', label: 'View Hotels', description: 'View hotel listings' },
      { key: 'hotels.manage', label: 'Manage Hotels', description: 'Create, edit, and remove hotels' },
      { key: 'hotels.bookings.view', label: 'View Hotel Bookings', description: 'View all hotel bookings' },
      { key: 'hotels.bookings.manage', label: 'Manage Hotel Bookings', description: 'Modify and cancel hotel bookings' },
    ],
  },
  {
    domain: 'tours',
    label: 'Tour Management',
    permissions: [
      { key: 'tours.view', label: 'View Tours', description: 'View tour listings' },
      { key: 'tours.manage', label: 'Manage Tours', description: 'Create, edit, and remove tours' },
      { key: 'tours.bookings.view', label: 'View Tour Bookings', description: 'View all tour bookings' },
      { key: 'tours.bookings.manage', label: 'Manage Tour Bookings', description: 'Modify and cancel tour bookings' },
    ],
  },
  {
    domain: 'transfers',
    label: 'Transfer Management',
    permissions: [
      { key: 'transfers.view', label: 'View Transfers', description: 'View transfer services' },
      { key: 'transfers.manage', label: 'Manage Transfers', description: 'Create, edit, and remove transfers' },
      { key: 'transfers.bookings.view', label: 'View Transfer Bookings', description: 'View all transfer bookings' },
      { key: 'transfers.bookings.manage', label: 'Manage Transfer Bookings', description: 'Modify and cancel transfer bookings' },
    ],
  },
  {
    domain: 'finance',
    label: 'Finance',
    permissions: [
      { key: 'finance.view', label: 'View Finances', description: 'View financial reports and transactions' },
      { key: 'finance.manage', label: 'Manage Finances', description: 'Process refunds and adjust billing' },
    ],
  },
  {
    domain: 'settings',
    label: 'System Settings',
    permissions: [
      { key: 'settings.view', label: 'View Settings', description: 'View system configuration' },
      { key: 'settings.manage', label: 'Manage Settings', description: 'Modify system configuration' },
    ],
  },
  {
    domain: 'notifications',
    label: 'Notifications',
    permissions: [
      { key: 'notifications.view', label: 'View Notifications', description: 'View system notifications' },
      { key: 'notifications.manage', label: 'Manage Notifications', description: 'Send and manage notifications' },
    ],
  },
  {
    domain: 'reports',
    label: 'Reports',
    permissions: [
      { key: 'reports.view', label: 'View Reports', description: 'Access analytics and reports' },
      { key: 'reports.export', label: 'Export Reports', description: 'Download report data' },
    ],
  },
];

export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  if (user.type !== 'admin') return false;
  if (user.roles.some((r) => r.name === 'super-admin')) return true;
  return user.permissions.includes(permission);
}

export function isSuperAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.roles.some((r) => r.name === 'super-admin');
}
