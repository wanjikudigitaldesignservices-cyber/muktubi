// ============================================================
// MUKTUBI — Student Portal
// Browse books, loans, reading log, streak, AI recommendations
// ============================================================

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getCenterAvailableBooks, 
  getMemberLoans, 
  getMemberReadingLogs, 
  getMemberRecommendations 
} from '@/lib/api';
import { BOOK_CATEGORIES } from '@/lib/constants';
import { formatDate, capitalize, daysUntilDue } from '@/lib/utils';
import {
  Search,
  BookOpen,
  Library,
  Star,
  Sparkles,
  Clock,
  Flame,
  BookMarked,
  Heart,
  MessageSquare,
  CalendarDays,
  Loader2,
} from 'lucide-react';

type StudentTab = 'browse' | 'loans' | 'reading-log' | 'recommendations';

export default function StudentPortal() {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StudentTab>('browse');

  // Async State
  const [loading, setLoading] = useState(true);
  const [availableBooks, setAvailableBooks] = useState<any[]>([]);
  const [myLoans, setMyLoans] = useState<any[]>([]);
  const [myReadingLogs, setMyReadingLogs] = useState<any[]>([]);
  const [myRecs, setMyRecs] = useState<any[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const memberId = profile?.id;
  const centerId = profile?.center_id || '123e4567-e89b-12d3-a456-426614174000'; // Default for demo if not logged in

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const tab = pathParts[2] as StudentTab;
    if (tab && ['browse', 'loans', 'reading-log', 'recommendations'].includes(tab)) {
      setActiveTab(tab);
    } else if (!tab) {
      setActiveTab('browse');
    }
  }, [location.pathname]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [booksData, loansData, logsData, recsData] = await Promise.all([
          getCenterAvailableBooks(centerId),
          memberId ? getMemberLoans(memberId) : Promise.resolve([]),
          memberId ? getMemberReadingLogs(memberId) : Promise.resolve([]),
          memberId ? getMemberRecommendations(memberId) : Promise.resolve([])
        ]);
        
        setAvailableBooks(booksData || []);
        setMyLoans(loansData || []);
        setMyReadingLogs(logsData || []);
        setMyRecs(recsData || []);
      } catch (err) {
        console.error("Failed to load student data:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [centerId, memberId]);

  const handleTabChange = (tab: StudentTab) => {
    setActiveTab(tab);
    navigate(tab === 'browse' ? '/student' : `/student/${tab}`);
  };

  const activeLoans = myLoans.filter((l) => l.status === 'active' || l.status === 'overdue');
  const returnedLoans = myLoans.filter((l) => l.status === 'returned');
  const booksRead = myReadingLogs.filter((rl) => rl.finished_date).length;

  const filteredBooks = availableBooks.filter((b) => {
    const matchesSearch = searchQuery === '' ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === '' || b.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const tabs = [
    { id: 'browse' as StudentTab, label: 'Browse Books', icon: Search },
    { id: 'loans' as StudentTab, label: 'My Loans', icon: BookOpen },
    { id: 'reading-log' as StudentTab, label: 'Reading Log', icon: BookMarked },
    { id: 'recommendations' as StudentTab, label: 'For You', icon: Sparkles },
  ];

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-in fade-in duration-300">
      {/* Welcome header with streak */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 280 }}>
          <h1 className="page-title">
            Hello, {profile?.full_name?.split(' ')[0] || 'Reader'}! 👋
          </h1>
          <p className="page-desc">
            Welcome to your library portal. Explore books and track your reading journey.
          </p>
        </div>

        {/* Reading Streak */}
        <div className="streak-card hover:scale-[1.02] transition-transform" style={{ minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, position: 'relative', zIndex: 1 }}>
            <Flame size={20} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Reading Streak</span>
          </div>
          <div style={{ display: 'flex', gap: 20, position: 'relative', zIndex: 1 }}>
            <div>
              <div className="streak-number">12</div>
              <div className="streak-label">days</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: 20 }}>
              <div className="streak-number" style={{ fontSize: 32 }}>{booksRead}</div>
              <div className="streak-label">books this term</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 12, position: 'relative', zIndex: 1 }}>
            {[true, true, true, true, true, false, false].map((active, i) => (
              <div
                key={i}
                style={{
                  width: 24,
                  height: 6,
                  borderRadius: 3,
                  background: active ? 'var(--mohi-amber-light)' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
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
            </span>
          </button>
        ))}
      </div>

      {/* Browse Books */}
      {activeTab === 'browse' && (
        <div className="animate-in slide-in-from-bottom-2 duration-300">
          {/* AI Search Bar */}
          <div style={{
            background: 'linear-gradient(135deg, var(--mohi-green-50), var(--mohi-amber-50))',
            borderRadius: 14,
            padding: 20,
            marginBottom: 20,
            border: '1px solid #E2E8F0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Sparkles size={16} style={{ color: 'var(--mohi-amber)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--mohi-green)' }}>AI-Powered Search</span>
            </div>
            <div className="filter-search" style={{ maxWidth: '100%', background: 'white' }}>
              <MessageSquare size={16} style={{ color: 'var(--mohi-amber)' }} />
              <input
                type="text"
                placeholder="Try: 'adventure books for Grade 4 in Swahili' or 'science books easier than Harry Potter'"
                style={{ fontSize: 14 }}
              />
            </div>
          </div>

          <div className="filter-bar flex-wrap">
            <div className="filter-search flex-1 min-w-[250px]">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search by title or author..."
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
          </div>

          <div className="card-grid">
            {filteredBooks.length > 0 ? filteredBooks.map((book) => (
              <div key={book.id} className="book-card group">
                <div className="book-card-cover transition-transform group-hover:scale-105">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <Library size={40} className="book-card-cover-icon" />
                  )}
                  <div
                    className="book-card-status-dot"
                    style={{ backgroundColor: '#22C55E' }}
                  />
                </div>
                <div className="book-card-body">
                  <div className="book-card-title truncate" title={book.title}>{book.title}</div>
                  <div className="book-card-author truncate">{book.author}</div>
                  <div className="book-card-meta mt-2 flex flex-wrap gap-1">
                    <span className="category-badge text-[10px]">{book.category}</span>
                    {book.reading_level && (
                      <span className="category-badge text-[10px]" style={{ background: '#DBEAFE', color: '#1E40AF' }}>
                        {book.reading_level}
                      </span>
                    )}
                  </div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                    <button className="btn btn-sm btn-primary" style={{ flex: 1 }}>
                      Reserve
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
                <Library size={32} className="mx-auto mb-3 opacity-50" />
                <p>No available books match your search.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My Loans */}
      {activeTab === 'loans' && (
        <div className="animate-in slide-in-from-bottom-2 duration-300">
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Active Loans ({activeLoans.length})</h3>
          {activeLoans.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {activeLoans.map((loan) => {
                const days = daysUntilDue(loan.due_date);
                return (
                  <div key={loan.id} className="card hover:border-slate-300 transition-colors" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div className="book-thumb" style={{ width: 48, height: 60 }}>
                      {loan.book?.cover_url ? (
                        <img src={loan.book.cover_url} alt="" className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <Library size={20} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{loan.book?.title}</div>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{loan.book?.author}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: days < 0 ? '#DC2626' : days < 3 ? '#D97706' : '#334155' }}>
                        <Clock size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
                        {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days left`}
                      </div>
                      <div style={{ fontSize: 11, color: '#94A3B8' }}>Due: {formatDate(loan.due_date)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state" style={{ paddingTop: 40, paddingBottom: 40 }}>
              <div className="empty-state-icon"><BookOpen size={28} /></div>
              <div className="empty-state-title">No Active Loans</div>
              <div className="empty-state-desc">Browse the catalog and reserve a book to get started!</div>
            </div>
          )}

          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Loan History</h3>
          <div className="chart-card">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="table-th">Book</th>
                    <th className="table-th">Borrowed</th>
                    <th className="table-th">Returned</th>
                    <th className="table-th">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {returnedLoans.map((loan) => (
                    <tr key={loan.id} className="table-row">
                      <td className="table-td font-medium">{loan.book?.title}</td>
                      <td className="table-td text-slate-500">{formatDate(loan.borrowed_date)}</td>
                      <td className="table-td text-slate-500">{loan.returned_date ? formatDate(loan.returned_date) : '—'}</td>
                      <td className="table-td">
                        <span className="status-badge status-returned">{capitalize(loan.status)}</span>
                      </td>
                    </tr>
                  ))}
                  {returnedLoans.length === 0 && (
                     <tr>
                       <td colSpan={4} className="py-8 text-center text-slate-400 italic">No past loans found.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reading Log */}
      {activeTab === 'reading-log' && (
        <div className="animate-in slide-in-from-bottom-2 duration-300">
          <div className="filter-bar">
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>My Reading Journal</h3>
            <button className="btn btn-primary" style={{ marginLeft: 'auto' }}>
              <BookMarked size={16} />
              Log a Book
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {myReadingLogs.length > 0 ? myReadingLogs.map((log) => {
              const book = log.book;
              return (
                <div key={log.id} className="card hover:border-slate-300 transition-colors">
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div className="book-thumb" style={{ width: 48, height: 60 }}>
                      {book?.cover_url ? (
                         <img src={book.cover_url} alt="" className="w-full h-full object-cover rounded-md" />
                      ) : (
                        <Library size={20} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{book?.title || 'Unknown Book'}</div>
                      <div style={{ fontSize: 12, color: '#64748B', marginBottom: 6 }}>{book?.author || 'Unknown Author'}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        {log.rating && (
                          <div style={{ display: 'flex', gap: 2 }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < log.rating! ? '#F59E0B' : 'none'}
                                stroke={i < log.rating! ? '#F59E0B' : '#D1D5DB'}
                              />
                            ))}
                          </div>
                        )}
                        <span className="category-badge text-[10px]">
                          <CalendarDays size={10} style={{ marginRight: 4 }} />
                          {log.started_date ? formatDate(log.started_date) : '—'}
                          {log.finished_date ? ` → ${formatDate(log.finished_date)}` : ' → reading...'}
                        </span>
                        {log.pages_read && (
                          <span className="category-badge text-[10px]">{log.pages_read} pages</span>
                        )}
                      </div>
                      {log.notes && (
                        <div style={{
                          marginTop: 8,
                          padding: '8px 12px',
                          background: '#F8FAFC',
                          borderRadius: 8,
                          fontSize: 13,
                          color: '#475569',
                          fontStyle: 'italic',
                          borderLeft: '3px solid var(--mohi-green-100)',
                        }}>
                          "{log.notes}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }) : (
               <div className="empty-state" style={{ paddingTop: 40, paddingBottom: 40 }}>
                 <div className="empty-state-icon"><BookMarked size={28} /></div>
                 <div className="empty-state-title">Your Journal is Empty</div>
                 <div className="empty-state-desc">Log your first book to start tracking your reading journey!</div>
               </div>
            )}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="animate-in slide-in-from-bottom-2 duration-300">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20,
            padding: 16, background: 'linear-gradient(135deg, var(--mohi-green-50), var(--mohi-amber-50))',
            borderRadius: 14, border: '1px solid #E2E8F0',
          }}>
            <Sparkles size={20} style={{ color: 'var(--mohi-amber)' }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--mohi-green-dark)' }}>Personalized for You</div>
              <div style={{ fontSize: 12, color: 'var(--mohi-green)' }}>
                Based on your reading history, grade level, and interests
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {myRecs.length > 0 ? myRecs.map((rec) => (
              <div key={rec.id} className="ai-rec-card group">
                <div className="ai-rec-header">
                  <div className="book-thumb" style={{ width: 40, height: 50 }}>
                    {rec.book?.cover_url ? (
                        <img src={rec.book.cover_url} alt="" className="w-full h-full object-cover rounded-md" />
                    ) : (
                      <Library size={16} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#0F172A' }}>{rec.book?.title}</div>
                    <div style={{ fontSize: 12, color: '#64748B' }}>{rec.book?.author}</div>
                  </div>
                  {rec.score && (
                    <div style={{
                      background: 'white',
                      borderRadius: 20,
                      padding: '3px 10px',
                      fontSize: 11,
                      fontWeight: 600,
                      color: 'var(--mohi-green)',
                      border: '1px solid var(--mohi-green-100)',
                    }}>
                      {(rec.score * 100).toFixed(0)}% match
                    </div>
                  )}
                </div>
                <div className="ai-rec-body">
                  <div className="book-card-meta">
                    <span className="category-badge text-[10px]">{rec.book?.category}</span>
                    {rec.book?.reading_level && (
                      <span className="category-badge text-[10px]" style={{ background: '#DBEAFE', color: '#1E40AF' }}>
                        {rec.book.reading_level}
                      </span>
                    )}
                  </div>
                  <div className="ai-rec-reason mt-3 text-slate-600 leading-relaxed text-sm">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4, fontSize: 11, fontWeight: 600, color: 'var(--mohi-amber-dark)' }}>
                      <Sparkles size={12} />
                      Why for you?
                    </div>
                    {rec.reason}
                  </div>
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button className="btn btn-sm btn-primary">
                      Reserve Book
                    </button>
                    <button className="btn btn-sm btn-secondary bg-white">
                      <Heart size={12} />
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="empty-state" style={{ paddingTop: 40, paddingBottom: 40 }}>
                <div className="empty-state-icon"><Sparkles size={28} style={{ color: 'var(--mohi-amber)' }} /></div>
                <div className="empty-state-title">No Recommendations Yet</div>
                <div className="empty-state-desc">Read more books to help our AI learn your preferences!</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
