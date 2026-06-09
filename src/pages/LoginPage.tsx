// ============================================================
// MUKTUBI — Login Page
// MOHI-branded login with role-based demo switching
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/lib/constants';
import type { Role } from '@/lib/types';
import {
  BookOpen,
  Library,
  Shield,
  GraduationCap,
  User,
  LogIn,
  Loader2,
  Sparkles,
} from 'lucide-react';

const ROLE_ICONS: Record<Role, typeof BookOpen> = {
  super_admin: Shield,
  center_librarian: Library,
  teacher: GraduationCap,
  student: User,
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, getDefaultPath } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await signIn(email, password);
    if (result.error) {
      setError(result.error);
    } else {
      navigate(getDefaultPath());
    }
    setIsLoading(false);
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb-1" />
        <div className="login-bg-orb login-bg-orb-2" />
        <div className="login-bg-orb login-bg-orb-3" />
      </div>

      <div className="login-container">
        {/* Left panel — brand */}
        <div className="login-brand">
          <div className="login-brand-content">
            <div className="login-logo-wrapper">
              <div className="login-logo-icon">
                <BookOpen size={40} strokeWidth={1.5} />
              </div>
              <h1 className="login-logo-text">MUKTUBI</h1>
            </div>
            <p className="login-tagline">
              Library Management System
            </p>
            <p className="login-subtitle">
              Empowering Young Readers Across Kenya
            </p>
            <div className="login-brand-badge">
              <Sparkles size={14} />
              <span>Missions of Hope International</span>
            </div>

            <div className="login-stats">
              <div className="login-stat">
                <span className="login-stat-num">38</span>
                <span className="login-stat-label">School Centers</span>
              </div>
              <div className="login-stat">
                <span className="login-stat-num">7,500+</span>
                <span className="login-stat-label">Books</span>
              </div>
              <div className="login-stat">
                <span className="login-stat-num">6,200+</span>
                <span className="login-stat-label">Students</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — login form */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-desc">
              Sign in to access your library dashboard
            </p>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="email" className="login-label">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@mohi.or.ke"
                  className="login-input"
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="password" className="login-label">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="login-input"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="login-btn"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <LogIn size={18} />
                )}
                <span>{isLoading ? 'Signing in...' : 'Sign In'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
