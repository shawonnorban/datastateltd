import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Settings, LayoutTemplate, Search, Server, Briefcase, Inbox, LogOut, BadgeCheck, Newspaper, BriefcaseBusiness } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth.jsx';
import { cn } from '@/lib/utils';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/settings', label: 'Site Settings', icon: Settings },
  { to: '/sections', label: 'Page Sections', icon: LayoutTemplate },
  { to: '/pages', label: 'Page Titles & SEO', icon: Search },
  { to: '/hosting', label: 'Domain & Hosting', icon: Server },
  { to: '/memberships', label: 'Certifications', icon: BadgeCheck },
  { to: '/posts', label: 'Blog & News', icon: Newspaper },
  { to: '/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { to: '/applications', label: 'Job Applications', icon: Briefcase },
  { to: '/inquiries', label: 'Inquiries', icon: Inbox },
];

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="flex min-h-screen">
      <aside className="bg-sidebar text-sidebar-foreground hidden w-64 shrink-0 flex-col md:flex">
        <div className="px-6 py-5">
          <div className="text-lg font-bold text-white">Inspire BD IT</div>
          <div className="text-xs text-slate-400">Administration</div>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to} to={to} end={end}
              className={({ isActive }) => cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent', isActive && 'bg-primary text-primary-foreground hover:bg-primary')}
            >
              <Icon className="size-4" /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="mb-2 truncate text-xs text-slate-400">{user?.email}</div>
          <Button variant="outline" size="sm" className="w-full bg-transparent text-white hover:bg-white/10 hover:text-white" onClick={logout}>
            <LogOut /> Sign out
          </Button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col bg-slate-50">
        <header className="flex items-center justify-between border-b bg-white px-4 py-3 md:hidden">
          <span className="font-semibold">Inspire BD IT Admin</span>
          <Button variant="ghost" size="sm" onClick={logout}><LogOut /></Button>
        </header>
        <nav className="flex gap-1 overflow-x-auto border-b bg-white px-2 py-2 md:hidden">
          {nav.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => cn('rounded-md px-3 py-1.5 text-xs whitespace-nowrap', isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>{label}</NavLink>
          ))}
        </nav>
        <main className="flex-1 p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
