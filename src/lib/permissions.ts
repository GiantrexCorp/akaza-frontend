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
      { key: 'list-users', label: 'List Users', description: 'View the user list' },
      { key: 'show-user', label: 'View User Detail', description: 'View individual user profiles' },
      { key: 'create-user', label: 'Create Users', description: 'Create new user accounts' },
      { key: 'update-user', label: 'Update Users', description: 'Edit user information, status, or delete users' },
      { key: 'assign-user-role', label: 'Assign Roles', description: 'Change user roles' },
    ],
  },
  {
    domain: 'customers',
    label: 'Customer Management',
    permissions: [
      { key: 'list-customers', label: 'List Customers', description: 'View the customer list' },
      { key: 'show-customer', label: 'View Customer', description: 'View individual customer details' },
      { key: 'add-customer-notes', label: 'Manage Notes', description: 'Create, edit, and delete customer notes' },
    ],
  },
  {
    domain: 'leads',
    label: 'Lead Management',
    permissions: [
      { key: 'manage-leads', label: 'Manage Leads', description: 'Create, view, edit, and convert leads' },
    ],
  },
  {
    domain: 'hotels',
    label: 'Hotel Management',
    permissions: [
      { key: 'manage-hotel-bookings', label: 'Manage Hotel Bookings', description: 'View, modify, and cancel hotel bookings' },
    ],
  },
  {
    domain: 'tours',
    label: 'Tour Management',
    permissions: [
      { key: 'create-tour', label: 'Create Tours', description: 'Create new tours' },
      { key: 'update-tour', label: 'Update Tours', description: 'Edit existing tours' },
      { key: 'delete-tour', label: 'Delete Tours', description: 'Remove tours' },
      { key: 'manage-tour-bookings', label: 'Manage Tour Bookings', description: 'View, modify, and cancel tour bookings' },
    ],
  },
  {
    domain: 'transfers',
    label: 'Transfer Management',
    permissions: [
      { key: 'create-transfer', label: 'Create Transfers', description: 'Create new transfer services' },
      { key: 'update-transfer', label: 'Update Transfers', description: 'Edit existing transfers' },
      { key: 'delete-transfer', label: 'Delete Transfers', description: 'Remove transfer services' },
      { key: 'manage-transfer-bookings', label: 'Manage Transfer Bookings', description: 'View, modify, and cancel transfer bookings' },
    ],
  },
  {
    domain: 'finance',
    label: 'Finance',
    permissions: [
      { key: 'view-financial-dashboard', label: 'View Financial Dashboard', description: 'View financial reports and transactions' },
      { key: 'manage-refunds', label: 'Manage Refunds', description: 'Process refunds and adjust billing' },
      { key: 'view-financial-reports', label: 'View Reports', description: 'Access analytics and reports' },
      { key: 'export-reports', label: 'Export Reports', description: 'Download report data' },
    ],
  },
  {
    domain: 'settings',
    label: 'System Settings',
    permissions: [
      { key: 'manage-settings', label: 'Manage Settings', description: 'View and modify system configuration' },
    ],
  },
  {
    domain: 'notifications',
    label: 'Notifications',
    permissions: [
      { key: 'manage-notification-templates', label: 'Manage Templates', description: 'View and edit notification templates' },
      { key: 'view-notification-logs', label: 'View Notification Logs', description: 'View notification delivery logs' },
    ],
  },
  {
    domain: 'audit',
    label: 'Audit',
    permissions: [
      { key: 'view-audit-logs', label: 'View Audit Logs', description: 'Access system audit trail' },
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
