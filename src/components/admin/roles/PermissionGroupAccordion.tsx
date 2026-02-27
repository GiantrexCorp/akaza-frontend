import { ChevronDown, ChevronRight } from 'lucide-react';
import { Toggle } from '@/components/ui';
import type { PermissionGroup } from '@/types/admin';

interface PermissionGroupAccordionProps {
  group: PermissionGroup;
  expanded: boolean;
  onToggleGroup: () => void;
  selectedPermissions: string[];
  onTogglePermission: (key: string) => void;
  disabled?: boolean;
}

export default function PermissionGroupAccordion({
  group,
  expanded,
  onToggleGroup,
  selectedPermissions,
  onTogglePermission,
  disabled,
}: PermissionGroupAccordionProps) {
  const selectedCount = group.permissions.filter((p) => selectedPermissions.includes(p.key)).length;

  return (
    <div className="border border-[var(--line-soft)]">
      <button
        type="button"
        onClick={onToggleGroup}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          {expanded ? (
            <ChevronDown size={14} className="text-[var(--text-muted)]" />
          ) : (
            <ChevronRight size={14} className="text-[var(--text-muted)]" />
          )}
          <span className="text-sm font-sans font-medium text-[var(--text-primary)]">
            {group.label}
          </span>
        </div>
        <span className="text-[10px] font-sans text-[var(--text-muted)]">
          {selectedCount}/{group.permissions.length}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-[var(--line-soft)] divide-y divide-[var(--line-soft)]">
          {group.permissions.map((perm) => (
            <div key={perm.key} className="flex items-center justify-between px-4 py-3 pl-10">
              <div className="flex-1 min-w-0 mr-4">
                <span className="text-sm font-sans text-[var(--text-primary)]">{perm.label}</span>
                <p className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{perm.description}</p>
              </div>
              <Toggle
                checked={selectedPermissions.includes(perm.key)}
                onChange={() => onTogglePermission(perm.key)}
                disabled={!!disabled}
                size="sm"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
