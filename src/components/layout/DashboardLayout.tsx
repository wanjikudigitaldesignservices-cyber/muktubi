// ============================================================
// MUKTUBI — Dashboard Layout
// Dark sidebar + white content area with MOHI branding
// ============================================================

import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { NAV_ITEMS, ROLES } from '@/lib/constants';
import { getInitials } from '@/lib/utils';
import type { Role } from '@/lib/types';
import {
  BookOpen,
  LayoutDashboard,
  Building2,
  BarChart3,
  Settings,
  ArrowLeftRight,
  Users,
  RotateCcw,
  CalendarClock,
  Search,
  NotebookPen,
  Sparkles,
  Library,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
} from 'lucide-react';

// Map icon names to components
const ICON_MAP: Record<string, typeof BookOpen> = {
  LayoutDashboard,
  Building2,
  BookOpen,
  BarChart3,
  Settings,
  ArrowLeftRight,
  Users,
  RotateCcw,
  CalendarClock,
  Search,
  NotebookPen,
  Sparkles,
  Library,
  FileText,
  BookPlus: BookOpen,
};

export default function DashboardLayout() {
  const { profile, signOut, isDemo, switchDemoRole } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  if (!profile) return null;

  const navItems = NAV_ITEMS[profile.role] || [];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };


  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <BookOpen size={24} strokeWidth={1.5} />
          </div>
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-name">MUKTUBI</span>
            <span className="sidebar-logo-sub">Library System</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Menu</div>
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.icon] || LayoutDashboard;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === ROLES[profile.role].defaultPath}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User profile */}
      <div className="sidebar-footer">
        <div className="sidebar-user" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
          <div className="sidebar-avatar">
            {getInitials(profile.full_name)}
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{profile.full_name}</span>
            <span className="sidebar-user-role">{ROLES[profile.role].label}</span>
          </div>
          <ChevronDown size={14} className={`sidebar-chevron ${profileMenuOpen ? 'rotate-180' : ''}`} />
        </div>
        {profileMenuOpen && (
          <div className="sidebar-profile-menu">
            <button onClick={handleSignOut} className="sidebar-link sidebar-signout">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="dashboard-layout">
      {/* Desktop sidebar */}
      <aside className="sidebar-desktop">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <aside className={`sidebar-mobile ${sidebarOpen ? 'sidebar-mobile-open' : ''}`}>
        <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="dashboard-main">
        {/* Top bar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="topbar-menu-btn" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="topbar-search">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search books, members, loans..."
                className="topbar-search-input"
              />
            </div>
          </div>
          <div className="topbar-right">
            <button className="topbar-notif">
              <Bell size={18} />
              <span className="topbar-notif-dot" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
