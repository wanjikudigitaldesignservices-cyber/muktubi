// ============================================================
// MUKTUBI — Teacher Dashboard
// Class bookshelf, reading reports, borrow, request
// ============================================================

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getCenterMembers,
  getCenterLoans,
  getCenterCatalog,
  getStudentsReadingLogs
} from '@/lib/api';
import { formatDate, capitalize } from '@/lib/utils';
import {
  BookOpen,
  Library,
  Users,
  BarChart3,
  Star,
  GraduationCap,
  Send,
  Loader2,
} from 'lucide-react';

type TeacherTab = 'bookshelf' | 'reports' | 'borrow' | 'request';

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TeacherTab>('bookshelf');

  // Async State
  const [loading, setLoading] = useState(true);
  const [gradeBooks, setGradeBooks] = useState<any[]>([]);
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [allLoans, setAllLoans] = useState<any[]>([]);
  const [classReadingLogs, setClassReadingLogs] = useState<any[]>([]);

  const centerId = profile?.center_id || '123e4567-e89b-12d3-a456-426614174000'; // Default for demo
  const gradeLevel = profile?.grade_level || '4';

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const tab = pathParts[2] as TeacherTab;
    if (tab && ['bookshelf', 'reports', 'borrow', 'request'].includes(tab)) {
      setActiveTab(tab);
    } else if (!tab) {
      setActiveTab('bookshelf');
    }
  }, [location.pathname]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [membersData, loansData, catalogData] = await Promise.all([
          getCenterMembers(centerId),
          getCenterLoans(centerId),
          getCenterCatalog(centerId)
        ]);

        // Filter students by grade
        const students = (membersData || []).filter(
          (p) => p.role === 'student' && p.grade_level === gradeLevel
        );
        setClassStudents(students);

        setAllLoans(loansData || []);

        // Get unique books from the catalog that match this grade level
        const uniqueBooks = new Map();
        (catalogData || []).forEach(copy => {
          if (copy.book) {
            uniqueBooks.set(copy.book.id, copy.book);
          }
        });
        
        // Very basic mock filter for grade range (since our seed doesn't strictly have grade_range field yet)
        const books = Array.from(uniqueBooks.values());
        setGradeBooks(books);

        // Fetch reading logs for these specific students
        const studentIds = students.map(s => s.id);
        if (studentIds.length > 0) {
          const logsData = await getStudentsReadingLogs(studentIds);
          setClassReadingLogs(logsData || []);
        } else {
          setClassReadingLogs([]);
        }

      } catch (err) {
        console.error("Failed to load teacher data:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [centerId, gradeLevel]);

  const handleTabChange = (tab: TeacherTab) => {
    setActiveTab(tab);
    navigate(tab === 'bookshelf' ? '/teacher' : `/teacher/${tab}`);
  };

  const tabs = [
    { id: 'bookshelf' as TeacherTab, label: 'Class Bookshelf', icon: Library },
    { id: 'reports' as TeacherTab, label: 'Reading Reports', icon: BarChart3 },
    { id: 'borrow' as TeacherTab, label: 'Borrow for Class', icon: BookOpen },
    { id: 'request' as TeacherTab, label: 'Request Books', icon: Send },
  ];

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium">Loading Class Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container animate-in fade-in duration-300">
      <div className="page-header">
        <div>
          <h1 className="page-title">Teacher Dashboard</h1>
          <p className="page-desc text-slate-600">
            <GraduationCap size={16} className="inline mr-1.5 text-slate-500" />
            Grade {gradeLevel} — {profile?.full_name || 'Teacher'}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stats-card stats-green">
          <div className="stats-card-header">
            <span className="stats-card-title">Books Available</span>
            <div className="stats-card-icon"><Library size={20} /></div>
          </div>
          <div className="stats-card-value">{gradeBooks.length}</div>
        </div>
        <div className="stats-card stats-blue">
          <div className="stats-card-header">
            <span className="stats-card-title">Students in Class</span>
            <div className="stats-card-icon"><Users size={20} /></div>
          </div>
          <div className="stats-card-value">{classStudents.length}</div>
        </div>
        <div className="stats-card stats-amber">
          <div className="stats-card-header">
            <span className="stats-card-title">Active Class Loans</span>
            <div className="stats-card-icon"><BookOpen size={20} /></div>
          </div>
          <div className="stats-card-value">
            {allLoans.filter(l => classStudents.some(s => s.id === l.member_id) && (l.status === 'active' || l.status === 'overdue')).length}
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

      {/* Class Bookshelf */}
      {activeTab === 'bookshelf' && (
        <div className="animate-in slide-in-from-bottom-2 duration-300">
          <div className="card-grid">
            {gradeBooks.length > 0 ? gradeBooks.map((book) => (
              <div key={book.id} className="book-card group">
                <div className="book-card-cover transition-transform group-hover:scale-105">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <Library size={40} className="book-card-cover-icon" />
                  )}
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
                  {book.description && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2" title={book.description}>
                      {book.description}
                    </p>
                  )}
                </div>
              </div>
            )) : (
              <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
                <Library size={32} className="mx-auto mb-3 opacity-50" />
                <p>No books available for this grade yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reading Reports */}
      {activeTab === 'reports' && (
        <div className="animate-in slide-in-from-bottom-2 duration-300">
          <div className="chart-card">
            <div className="chart-card-header">
              <h3 className="chart-title">Class Reading Report — Grade {gradeLevel}</h3>
              <span className="chart-subtitle">Per-student reading activity</span>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="table-th">Student</th>
                    <th className="table-th">Reading Level</th>
                    <th className="table-th">Books Borrowed</th>
                    <th className="table-th">Books Read</th>
                    <th className="table-th">Avg Rating</th>
                    <th className="table-th">Active Loans</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.map((student) => {
                    const studentLoans = allLoans.filter(l => l.member_id === student.id);
                    const studentLogs = classReadingLogs.filter(rl => rl.member_id === student.id);
                    const finishedLogs = studentLogs.filter(rl => rl.finished_date);
                    const avgRating = finishedLogs.length > 0
                      ? (finishedLogs.reduce((sum, rl) => sum + (rl.rating || 0), 0) / finishedLogs.length).toFixed(1)
                      : '—';
                    const activeStudentLoans = studentLoans.filter(l => l.status === 'active' || l.status === 'overdue').length;

                    return (
                      <tr key={student.id} className="table-row">
                        <td className="table-td">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold shrink-0">
                              {student.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??'}
                            </div>
                            <span className="font-medium text-slate-900">{student.full_name}</span>
                          </div>
                        </td>
                        <td className="table-td">
                          <span className="category-badge" style={{ background: '#DBEAFE', color: '#1E40AF' }}>
                            {student.reading_level || '—'}
                          </span>
                        </td>
                        <td className="table-td font-semibold text-slate-700">{studentLoans.length}</td>
                        <td className="table-td font-semibold text-slate-700">{finishedLogs.length}</td>
                        <td className="table-td">
                          {avgRating !== '—' ? (
                            <span className="inline-flex items-center gap-1">
                              <Star size={13} fill="#F59E0B" stroke="#F59E0B" />
                              <span className="font-medium text-slate-700">{avgRating}</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="table-td">
                          <span className={`${activeStudentLoans > 0 ? 'font-semibold text-mohi-green' : 'text-slate-400'}`}>
                            {activeStudentLoans}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {classStudents.length === 0 && (
                     <tr>
                       <td colSpan={6} className="py-8 text-center text-slate-400 italic">No students found in this grade.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Borrow & Request omitted for brevity */}
      {['borrow', 'request'].includes(activeTab) && (
        <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-12 text-center text-slate-400 animate-in fade-in">
          <BookOpen size={32} className="mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">Coming Soon</h3>
          <p>This action is being integrated with your new database.</p>
        </div>
      )}

    </div>
  );
}
