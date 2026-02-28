import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
}

interface NavLinksProps {
  links: NavLink[];
  isActiveLink: (href: string) => boolean;
  isLight: boolean;
  inactiveLinkStyle: string;
  activeLinkStyle: string;
}

export default function NavLinks({ links, isActiveLink, isLight, inactiveLinkStyle, activeLinkStyle }: NavLinksProps) {
  return (
    <div className="hidden md:flex items-center gap-1">
      {links.map((link) => {
        const isActive = isActiveLink(link.href);
        const isVipLink = link.href === '/#vip';
        return (
          <Link
            key={link.label}
            href={link.href}
            className={`rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] transition-all ${
              isVipLink
                ? isActive
                  ? 'text-[var(--nav-vip-text)] bg-black/[0.08] shadow-[inset_0_0_0_1px_rgba(255,210,145,0.72),0_10px_22px_-16px_rgba(216,154,80,0.95)]'
                  : isLight
                    ? 'text-[var(--nav-vip-text)] bg-white/75 shadow-[inset_0_0_0_1px_rgba(206,144,77,0.65)] hover:bg-white hover:text-[var(--nav-vip-hover)] hover:translate-y-[-1px] hover:shadow-[inset_0_0_0_1px_rgba(206,144,77,0.9),0_12px_24px_-16px_rgba(206,144,77,0.95)]'
                    : 'text-[var(--nav-vip-hover)] bg-black/20 shadow-[inset_0_0_0_1px_rgba(255,210,145,0.55)] hover:bg-black/30 hover:text-[var(--nav-vip-hover-bright)] hover:translate-y-[-1px] hover:shadow-[inset_0_0_0_1px_rgba(255,214,151,0.95),0_12px_24px_-14px_rgba(241,194,122,0.95)]'
                : isActive
                  ? activeLinkStyle
                  : inactiveLinkStyle
            }`}
          >
            {isVipLink ? (
              <span className="group inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-90 transition-all group-hover:scale-125 group-hover:opacity-100" />
                <span className="relative overflow-hidden">
                  <span className="pointer-events-none absolute inset-y-0 left-[-140%] w-1/2 rotate-[12deg] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-all duration-500 group-hover:left-[130%] group-hover:opacity-80" />
                  <span className="relative">{link.label}</span>
                </span>
              </span>
            ) : (
              link.label
            )}
          </Link>
        );
      })}
    </div>
  );
}
