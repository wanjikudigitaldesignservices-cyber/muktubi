// ============================================================
// MUKTUBI — HQ Dashboard Overview
// Network-wide stats, charts, and top borrowed books
// ============================================================

import {
  DEMO_CENTERS,
  DEMO_BOOKS,
  DEMO_LOANS,
  DEMO_LOANS_PER_WEEK,
  DEMO_TOP_BORROWED,
} from '@/lib/demo-data';
import { formatNumber } from '@/lib/utils';
import {
  BookOpen,
  Users,
  ArrowLeftRight,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Library,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function HQOverview() {
  const totalBooks = DEMO_CENTERS.reduce((sum, c) => sum + c.total_books, 0);
  const totalMembers = DEMO_CENTERS.reduce((sum, c) => sum + c.active_members, 0);
  const activeLoans = DEMO_LOANS.filter((l) => l.status === 'active').length;
  const overdueLoans = DEMO_LOANS.filter((l) => l.status === 'overdue').length;

  // Books per center (top 15 for chart readability)
  const booksPerCenter = DEMO_CENTERS
    .sort((a, b) => b.total_books - a.total_books)
    .slice(0, 15)
    .map((c) => ({
      name: c.name.replace('MOHI ', ''),
      books: c.total_books,
    }));

  const stats = [
    {
      title: 'Total Books Network-wide',
      value: formatNumber(totalBooks),
      change: '+12%',
      changeType: 'positive' as const,
      icon: BookOpen,
      color: 'stats-green',
    },
    {
      title: 'Active Loans Today',
      value: formatNumber(activeLoans),
      change: '+8%',
      changeType: 'positive' as const,
      icon: ArrowLeftRight,
      color: 'stats-blue',
    },
    {
      title: 'Overdue Loans',
      value: formatNumber(overdueLoans),
      change: '-5%',
      changeType: 'negative' as const,
      icon: AlertTriangle,
      color: 'stats-red',
    },
    {
      title: 'Total Students',
      value: formatNumber(totalMembers),
      change: '+15%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'stats-amber',
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">HQ Dashboard</h1>
          <p className="page-desc">Network-wide overview across all 38 MOHI centers</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.title} className={`stats-card ${stat.color}`}>
            <div className="stats-card-header">
              <span className="stats-card-title">{stat.title}</span>
              <div className="stats-card-icon">
                <stat.icon size={20} />
              </div>
            </div>
            <div className="stats-card-value">{stat.value}</div>
            <div className={`stats-card-change ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-500'}`}>
              {stat.changeType === 'positive' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{stat.change} from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Books per Center */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-title">Books per Center</h3>
            <span className="chart-subtitle">Top 15 centers by catalog size</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={booksPerCenter} margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fontSize: 11, fill: 'var(--chart-text)' }}
                  height={80}
                />
                <YAxis tick={{ fontSize: 12, fill: 'var(--chart-text)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--chart-tooltip-bg)',
                    border: '1px solid var(--chart-tooltip-border)',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Bar
                  dataKey="books"
                  fill="var(--mohi-green)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Loans per Week */}
        <div className="chart-card">
          <div className="chart-card-header">
            <h3 className="chart-title">Loans & Returns Trend</h3>
            <span className="chart-subtitle">Last 12 weeks</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={DEMO_LOANS_PER_WEEK} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'var(--chart-text)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--chart-text)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--chart-tooltip-bg)',
                    border: '1px solid var(--chart-tooltip-border)',
                    borderRadius: '8px',
                    fontSize: '13px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="loans"
                  stroke="var(--mohi-green)"
                  strokeWidth={2.5}
                  dot={{ fill: 'var(--mohi-green)', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Loans"
                />
                <Line
                  type="monotone"
                  dataKey="returns"
                  stroke="var(--mohi-amber)"
                  strokeWidth={2.5}
                  dot={{ fill: 'var(--mohi-amber)', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Returns"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Borrowed Books */}
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-title">Top 5 Most Borrowed Books</h3>
          <span className="chart-subtitle">All-time across all centers</span>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="table-th">#</th>
                <th className="table-th">Title</th>
                <th className="table-th">Author</th>
                <th className="table-th">Category</th>
                <th className="table-th text-right">Total Loans</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_TOP_BORROWED.map((item, idx) => (
                <tr key={item.book.id} className="table-row">
                  <td className="table-td">
                    <span className="rank-badge">{idx + 1}</span>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="book-thumb">
                        <Library size={16} />
                      </div>
                      <span className="font-medium">{item.book.title}</span>
                    </div>
                  </td>
                  <td className="table-td text-muted">{item.book.author}</td>
                  <td className="table-td">
                    <span className="category-badge">{item.book.category}</span>
                  </td>
                  <td className="table-td text-right font-semibold">{formatNumber(item.totalLoans)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
