// ============================================================
// MUKTUBI — Center Dashboard (Catalog Tab)
// Book catalog for a specific MOHI center
// ============================================================

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getCenterCatalog, getCenterLoans, getCenterMembers } from '@/lib/api';
import { BOOK_CATEGORIES, CONDITION_COLORS } from '@/lib/constants';
import { formatDate, getRiskLevel, capitalize, daysUntilDue } from '@/lib/utils';
import {
  BookOpen,
  Search,
  Plus,
  ArrowLeftRight,
  Users,
  AlertTriangle,
  RotateCcw,
  CalendarClock,
  Library,
  TrendingUp,
  CheckCircle,
  XCircle,
  Package,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import AddMemberModal from '@/components/AddMemberModal';
import AddBookModal from '@/components/AddBookModal';

type CenterTab = 'catalog' | 'loans' | 'members' | 'returns' | 'reservations' | 'reports';

export default function CenterDashboard() {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<CenterTab>('catalog');

  // Async State
  const [loading, setLoading] = useState(true);
  const [centerCopies, setCenterCopies] = useState<any[]>([]);
  const [centerLoans, setCenterLoans] = useState<any[]>([]);
  const [centerMembers, setCenterMembers] = useState<any[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Modals
  const [showAddMember, setShowAddMember] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);

  const centerId = profile?.center_id || '123e4567-e89b-12d3-a456-426614174000'; // Default to Mathare for demo

  const loadData = async () => {
    setLoading(true);
    try {
      const [copiesData, loansData, membersData] = await Promise.all([
        getCenterCatalog(centerId),
        getCenterLoans(centerId),
        getCenterMembers(centerId)
      ]);
      setCenterCopies(copiesData || []);
      setCenterLoans(loansData || []);
      setCenterMembers(membersData || []);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const tab = pathParts[2] as CenterTab;
    if (tab && ['catalog', 'loans', 'members', 'returns', 'reservations', 'reports'].includes(tab)) {
      setActiveTab(tab);
    } else if (!tab) {
      setActiveTab('catalog');
    }
  }, [location.pathname]);

  // Fetch Data
  useEffect(() => {
    if (centerId) {
      loadData();
    }
  }, [centerId]);

  const handleTabChange = (tab: CenterTab) => {
    setActiveTab(tab);
    navigate(tab === 'catalog' ? '/center' : `/center/${tab}`);
  };

  // Derived State
  const activeLoans = centerLoans.filter((l) => l.status === 'active' || l.status === 'overdue');
  const overdueLoans = centerLoans.filter((l) => l.status === 'overdue');
  
  // Note: Reservations not yet implemented in DB schema, mocking for UI
  const centerReservations: any[] = [];

  const filteredCopies = centerCopies.filter((copy) => {
    const book = copy.book;
    if (!book) return false;
    const matchesSearch = searchQuery === '' ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === '' || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const tabs: Array<{ id: CenterTab; label: string; icon: typeof BookOpen; count?: number }> = [
    { id: 'catalog', label: 'Catalog', icon: BookOpen, count: centerCopies.length },
    { id: 'loans', label: 'Loans', icon: ArrowLeftRight, count: activeLoans.length },
    { id: 'members', label: 'Members', icon: Users, count: centerMembers.length },
    { id: 'returns', label: 'Returns', icon: RotateCcw },
    { id: 'reservations', label: 'Reservations', icon: CalendarClock, count: centerReservations.length },
    { id: 'reports', label: 'Reports', icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium">Loading Center Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-in fade-in duration-300">
      <div className="page-header">
        <div>
          <h1 className="page-title">Center Dashboard</h1>
          <p className="page-desc">
            Managing library operations for your center
          </p>
        </div>
        <button className="btn btn-primary">
          <Plus size={16} />
          Quick Loan
        </button>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stats-card stats-green">
          <div className="stats-card-header">
            <span className="stats-card-title">Total Copies</span>
            <div className="stats-card-icon"><Package size={20} /></div>
          </div>
          <div className="stats-card-value">{centerCopies.length}</div>
        </div>
        <div className="stats-card stats-blue">
          <div className="stats-card-header">
            <span className="stats-card-title">Active Loans</span>
            <div className="stats-card-icon"><ArrowLeftRight size={20} /></div>
          </div>
          <div className="stats-card-value">{activeLoans.length}</div>
        </div>
        <div className="stats-card stats-red">
          <div className="stats-card-header">
            <span className="stats-card-title">Overdue</span>
            <div className="stats-card-icon"><AlertTriangle size={20} /></div>
          </div>
          <div className="stats-card-value">{overdueLoans.length}</div>
        </div>
        <div className="stats-card stats-amber">
          <div className="stats-card-header">
            <span className="stats-card-title">Members</span>
            <div className="stats-card-icon"><Users size={20} /></div>
          </div>
          <div className="stats-card-value">{centerMembers.length}</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav overflow-x-auto whitespace-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'tab-btn-active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <tab.icon size={15} />
              {tab.label}
              {tab.count !== undefined && (
                <span className="category-badge" style={{ fontSize: '10px' }}>{tab.count}</span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'catalog' && (
        <div className="animate-in slide-in-from-bottom-2 duration-300">
          <div className="filter-bar flex-wrap">
            <div className="filter-search flex-1 min-w-[250px]">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
              {BOOK_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button className="btn btn-primary whitespace-nowrap" onClick={() => setShowAddBook(true)}>
              <Plus size={16} />
              Add Copy
            </button>
          </div>

          <div className="card-grid">
            {filteredCopies.length > 0 ? filteredCopies.map((copy) => (
              <div key={copy.id} className="book-card group">
                <div className="book-card-cover transition-transform group-hover:scale-105">
                  {copy.book?.cover_url ? (
                    <img src={copy.book.cover_url} alt={copy.book.title} className="w-full h-full object-cover" />
                  ) : (
                    <Library size={40} className="book-card-cover-icon" />
                  )}
                  <div
                    className="book-card-status-dot"
                    style={{
                      backgroundColor: copy.status === 'available' ? '#22C55E' :
                        copy.status === 'borrowed' ? '#3B82F6' : '#F59E0B'
                    }}
                  />
                </div>
                <div className="book-card-body">
                  <div className="book-card-title truncate" title={copy.book?.title}>{copy.book?.title}</div>
                  <div className="book-card-author truncate">{copy.book?.author}</div>
                  <div className="book-card-meta mt-2 flex flex-wrap gap-1">
                    <span className="category-badge text-[10px]">{copy.book?.category}</span>
                    <span className={`status-badge status-${copy.status} text-[10px]`}>
                      {capitalize(copy.status)}
                    </span>
                    <span className={`category-badge ${CONDITION_COLORS[copy.condition] || ''} text-[10px]`}>
                      {capitalize(copy.condition)}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
                <Library size={32} className="mx-auto mb-3 opacity-50" />
                <p>No books found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'loans' && (
        <div className="animate-in slide-in-from-bottom-2 duration-300">
          <div className="chart-card">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="table-th">Member</th>
                    <th className="table-th">Book</th>
                    <th className="table-th">Borrowed</th>
                    <th className="table-th">Due Date</th>
                    <th className="table-th">Status</th>
                    <th className="table-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeLoans.map((loan) => {
                    const days = daysUntilDue(loan.due_date);
                    return (
                      <tr key={loan.id} className="table-row">
                        <td className="table-td">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                              {loan.member?.avatar_url ? (
                                <img src={loan.member.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                loan.member?.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{loan.member?.full_name || 'Unknown Member'}</span>
                          </div>
                        </td>
                        <td className="table-td text-slate-700">{loan.book?.title}</td>
                        <td className="table-td text-slate-500">{formatDate(loan.borrowed_date)}</td>
                        <td className="table-td">
                          <span className={`inline-flex items-center gap-1.5 ${days < 0 ? 'text-red-600 font-medium' : days < 3 ? 'text-amber-600 font-medium' : 'text-slate-600'}`}>
                            {formatDate(loan.due_date)}
                            {days < 0 && <span className="text-[10px] uppercase tracking-wider bg-red-50 px-1.5 py-0.5 rounded">({Math.abs(days)}d overdue)</span>}
                          </span>
                        </td>
                        <td className="table-td">
                          <span className={`status-badge status-${loan.status}`}>
                            {capitalize(loan.status)}
                          </span>
                        </td>
                        <td className="table-td text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="btn btn-sm btn-secondary bg-white hover:bg-slate-50">
                              <RotateCcw size={14} />
                              Renew
                            </button>
                            <button className="btn btn-sm btn-primary">
                              <CheckCircle size={14} />
                              Return
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {activeLoans.length === 0 && (
                     <tr>
                       <td colSpan={6} className="py-8 text-center text-slate-400 italic">No active loans right now.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'members' && (
        <div className="animate-in slide-in-from-bottom-2 duration-300">
          <div className="filter-bar">
            <div className="filter-search flex-1">
              <Search size={16} />
              <input type="text" placeholder="Search members..." />
            </div>
            <button className="btn btn-primary whitespace-nowrap" onClick={() => setShowAddMember(true)}>
              <Plus size={16} />
              Add Member
            </button>
          </div>

          <div className="chart-card">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="table-th">Name</th>
                    <th className="table-th">Role</th>
                    <th className="table-th">Grade</th>
                    <th className="table-th">Reading Level</th>
                    <th className="table-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {centerMembers.map((member) => {
                    return (
                      <tr key={member.id} className="table-row">
                        <td className="table-td">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                              {member.avatar_url ? (
                                <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                member.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
                              )}
                            </div>
                            <span className="font-medium text-slate-900">{member.full_name}</span>
                          </div>
                        </td>
                        <td className="table-td">
                          <span className="category-badge">{capitalize(member.role)}</span>
                        </td>
                        <td className="table-td text-slate-600">{member.grade_level || '—'}</td>
                        <td className="table-td text-slate-600">{member.reading_level || '—'}</td>
                        <td className="table-td text-right">
                          <button 
                            className="btn btn-sm btn-secondary bg-white hover:bg-slate-50"
                            onClick={() => navigate(`/center/member/${member.id}`)}
                          >
                            View Profile
                            <ChevronRight size={14} className="text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {centerMembers.length === 0 && (
                     <tr>
                       <td colSpan={5} className="py-8 text-center text-slate-400 italic">No members found.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reports, Returns, Reservations are omitted for brevity, but they follow the same pattern */}
      {['returns', 'reservations', 'reports'].includes(activeTab) && (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center text-slate-400 animate-in fade-in">
          <TrendingUp size={32} className="mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">Coming Soon</h3>
          <p>This section is being wired up to the new database.</p>
        </div>
      )}

      {showAddMember && (
        <AddMemberModal 
          onClose={() => setShowAddMember(false)} 
          onSuccess={() => { loadData(); alert("Member successfully added! (Password: password123)"); }}
        />
      )}

      {showAddBook && (
        <AddBookModal 
          onClose={() => setShowAddBook(false)} 
          onSuccess={() => { loadData(); alert("Book copy successfully added to catalog!"); }}
        />
      )}
    </div>
  );
}
