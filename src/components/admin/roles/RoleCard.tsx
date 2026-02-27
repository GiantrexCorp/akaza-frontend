'use client';

import Link from 'next/link';
import { Shield, Users, ChevronRight } from 'lucide-react';
import type { AdminRole } from '@/types/admin';

interface RoleCardProps {
  role: AdminRole;
}

export default function RoleCard({ role }: RoleCardProps) {
  const isSuperAdmin = role.name === 'super-admin';
  const permissionCount = role.permissions?.length ?? 0;

  return (
    <Link href={`/admin/roles/${role.id}`}>
      <div className="group bg-[var(--surface-card)] border border-[var(--line-soft)] p-6 hover:border-primary/40 transition-all duration-200 cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center shrink-0">
              <Shield size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-serif text-[var(--text-primary)] group-hover:text-primary transition-colors">
                {role.name}
              </h3>
              {isSuperAdmin && (
                <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-primary/70">
                  Protected
                </span>
              )}
            </div>
          </div>
          <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-primary transition-colors mt-1" />
        </div>

        <div className="flex items-center gap-4 text-xs font-sans text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <Users size={12} />
            <span>{role.users_count ?? 0} user{(role.users_count ?? 0) !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield size={12} />
            <span>
              {isSuperAdmin ? 'All permissions' : `${permissionCount} permission${permissionCount !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
