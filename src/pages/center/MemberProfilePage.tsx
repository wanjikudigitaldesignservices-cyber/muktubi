import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, BookOpen, Clock, CalendarDays, Star, Award, 
  MessageSquare, UserPlus, Library, MoreHorizontal, Loader2, Camera 
} from 'lucide-react';
import { getMemberProfile, getMemberLoans, getMemberReadingLogs, uploadAvatar } from '@/lib/api';
import { formatDate, capitalize } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export default function MemberProfilePage() {
  const { memberId } = useParams<{ memberId: string }>();
  const navigate = useNavigate();
  const { profile: currentUserProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<any>(null);
  const [memberLoans, setMemberLoans] = useState<any[]>([]);
  const [memberReadingLogs, setMemberReadingLogs] = useState<any[]>([]);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!memberId) return;
      setLoading(true);
      try {
        const [profileData, loansData, logsData] = await Promise.all([
          getMemberProfile(memberId),
          getMemberLoans(memberId),
          getMemberReadingLogs(memberId)
        ]);
        
        setMember(profileData);
        setMemberLoans(loansData || []);
        setMemberReadingLogs(logsData || []);
      } catch (err) {
        console.error("Failed to load member profile:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [memberId]);

  // Generate a chronological timeline of activity
  const timeline = useMemo(() => {
    const activities: any[] = [];
    
    // Add loans (borrowing events)
    memberLoans.forEach(loan => {
      if (loan.borrowed_date) {
        activities.push({
          id: `loan-${loan.id}`,
          type: 'borrow',
          date: new Date(loan.borrowed_date).getTime(),
          data: loan,
        });
      }
      if (loan.returned_date) {
        activities.push({
          id: `return-${loan.id}`,
          type: 'return',
          date: new Date(loan.returned_date).getTime(),
          data: loan,
        });
      }
    });

    // Add reading logs (review/finish events)
    memberReadingLogs.forEach(log => {
      if (log.finished_date) {
        activities.push({
          id: `log-${log.id}`,
          type: 'review',
          date: new Date(log.finished_date).getTime(),
          data: log, // the book object is nested inside from the API
        });
      }
    });

    // Sort descending by date
    return activities.sort((a, b) => b.date - a.date);
  }, [memberLoans, memberReadingLogs]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !member) return;

    try {
      setUploadingAvatar(true);
      const newAvatarUrl = await uploadAvatar(member.id, file);
      // Optimistically update UI
      setMember({ ...member, avatar_url: newAvatarUrl });
    } catch (err) {
      console.error("Failed to upload avatar:", err);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setUploadingAvatar(false);
    }
  };



  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center text-slate-400">
          <Loader2 className="animate-spin mb-4" size={40} />
          <p className="font-medium">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="page-container flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-slate-800">Member Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-4 btn btn-primary">Go Back</button>
      </div>
    );
  }

  const activeLoansCount = memberLoans.filter(l => l.status === 'active' || l.status === 'overdue').length;
  const booksReadCount = memberReadingLogs.filter(rl => rl.finished_date).length;

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 animate-in fade-in duration-500">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center gap-4 py-4 px-2 sm:px-6 mb-2">
        <button 
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="font-bold text-slate-900 text-lg">Member Profile</div>
      </div>

      {/* Cover Photo Area */}
      <div className="relative rounded-t-3xl overflow-hidden h-48 sm:h-64 bg-gradient-to-br from-[var(--mohi-green-900)] via-[var(--mohi-green)] to-[var(--mohi-amber-dark)]">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      </div>

      {/* Profile Info Section (Overlapping Cover) */}
      <div className="px-6 sm:px-10 relative">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            {/* Avatar */}
            <div className="relative group shrink-0 z-10">
              <div className="w-32 h-32 rounded-full bg-white text-[var(--mohi-green)] flex items-center justify-center text-4xl font-black shadow-xl ring-4 ring-white border-4 border-slate-50 overflow-hidden">
                {uploadingAvatar ? (
                  <Loader2 className="animate-spin text-slate-300" size={32} />
                ) : member.avatar_url ? (
                  <img src={member.avatar_url} alt={member.full_name} className="w-full h-full object-cover" />
                ) : (
                  member.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '?'
                )}
              </div>
              
              {/* Upload Overlay (Only if looking at own profile) */}
              {currentUserProfile?.id === member.id && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <Camera size={24} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploadingAvatar} />
                </label>
              )}
            </div>
            
            <div className="text-center sm:text-left mt-2 sm:mt-0 sm:pb-2">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{member.full_name}</h1>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--mohi-green-100)] text-[var(--mohi-green-900)]">
                  {capitalize(member.role)}
                </span>
                {member.grade_level && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--mohi-amber-light)] text-amber-900">
                    Grade {member.grade_level}
                  </span>
                )}
                {member.reading_level && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                    {member.reading_level}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center sm:justify-end gap-3 sm:pb-2">
            <button className="btn btn-secondary !rounded-full !px-5 !py-2.5 bg-white">
              <MessageSquare size={16} className="mr-2" />
              Message
            </button>
            <button className="btn btn-primary !rounded-full !px-5 !py-2.5">
              <BookOpen size={16} className="mr-2" />
              Recommend Book
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-center sm:justify-start gap-8 sm:gap-12 mb-10 border-b border-slate-100 pb-8">
          <div className="text-center sm:text-left">
            <div className="text-2xl font-black text-slate-900">{booksReadCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1.5 justify-center sm:justify-start">
              <Award size={12} /> Books Read
            </div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-2xl font-black text-slate-900">{activeLoansCount}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1.5 justify-center sm:justify-start">
              <Library size={12} /> Active Loans
            </div>
          </div>
          <div className="text-center sm:text-left">
            <div className="text-2xl font-black text-slate-900">{timeline.length}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1.5 justify-center sm:justify-start">
              <CalendarDays size={12} /> Activities
            </div>
          </div>
        </div>

        {/* Timeline / Feed */}
        <div className="max-w-2xl mx-auto sm:mx-0 w-full relative">
          
          <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
            <Clock className="text-slate-400" />
            Activity Timeline
          </h2>

          {/* Vertical line connecting timeline items */}
          {timeline.length > 0 && <div className="absolute left-[27px] top-[70px] bottom-0 w-px bg-slate-200" />}

          <div className="space-y-8">
            {timeline.length > 0 ? timeline.map(activity => (
              <div key={activity.id} className="flex gap-4 sm:gap-6 relative z-10 group">
                
                {/* Timeline Icon */}
                <div className="shrink-0 mt-1">
                  {activity.type === 'borrow' && (
                    <div className="w-14 h-14 rounded-full bg-blue-50 border-4 border-white flex items-center justify-center text-blue-500 shadow-sm group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                      <BookOpen size={20} strokeWidth={2.5} />
                    </div>
                  )}
                  {activity.type === 'return' && (
                    <div className="w-14 h-14 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-slate-500 shadow-sm group-hover:scale-110 group-hover:bg-slate-200 transition-all">
                      <Library size={20} strokeWidth={2.5} />
                    </div>
                  )}
                  {activity.type === 'review' && (
                    <div className="w-14 h-14 rounded-full bg-[var(--mohi-amber-light)] border-4 border-white flex items-center justify-center text-amber-600 shadow-sm group-hover:scale-110 group-hover:bg-amber-200 transition-all">
                      <Star size={20} strokeWidth={2.5} />
                    </div>
                  )}
                </div>

                {/* Timeline Content */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] p-5 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] transition-all">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="text-sm">
                      <span className="font-bold text-slate-900">{member.full_name?.split(' ')[0]}</span>
                      {' '}
                      <span className="text-slate-600">
                        {activity.type === 'borrow' && 'borrowed a book'}
                        {activity.type === 'return' && 'returned a book'}
                        {activity.type === 'review' && 'finished reading and reviewed a book'}
                      </span>
                    </div>
                    <div className="shrink-0 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      {formatDate(new Date(activity.date).toISOString().split('T')[0])}
                    </div>
                  </div>

                  {/* Context Card (The Book/Review details) */}
                  <div className="mt-3 bg-slate-50 rounded-xl p-4 border border-slate-100/60">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-14 bg-slate-200 rounded shrink-0 flex items-center justify-center shadow-sm overflow-hidden">
                        {activity.data.book?.cover_url ? (
                            <img src={activity.data.book.cover_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <BookOpen size={16} className="text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 text-sm leading-snug">
                          {activity.data.book?.title || 'Unknown Book'}
                        </div>
                        <div className="text-xs text-slate-500 mb-2">
                          {activity.data.book?.author || 'Unknown Author'}
                        </div>
                        
                        {/* If it's a review, show stars and notes */}
                        {activity.type === 'review' && (
                          <div className="mt-2">
                            {activity.data.rating && (
                              <div className="flex gap-0.5 mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    size={14}
                                    className={i < activity.data.rating! ? "fill-[var(--mohi-amber)] text-[var(--mohi-amber)]" : "text-slate-200"}
                                  />
                                ))}
                              </div>
                            )}
                            {activity.data.notes && (
                              <div className="relative text-sm text-slate-700 bg-white p-4 rounded-xl border border-slate-100 italic leading-relaxed shadow-sm mt-1">
                                <div className="absolute top-2 left-2 text-slate-200 text-3xl font-serif leading-none">"</div>
                                <span className="relative z-10 pl-2 block">{activity.data.notes}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Engagement / Social Actions */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[var(--mohi-green)] transition-colors uppercase tracking-wider">
                      <UserPlus size={14} />
                      Encourage
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors uppercase tracking-wider">
                      <MessageSquare size={14} />
                      Comment
                    </button>
                    <div className="ml-auto">
                      <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="bg-slate-50 rounded-2xl border border-slate-100 border-dashed p-12 text-center">
                <Clock className="mx-auto mb-3 text-slate-300" size={32} />
                <h3 className="text-lg font-bold text-slate-700 mb-1">No Activity Yet</h3>
                <p className="text-slate-500">This member hasn't borrowed or reviewed any books.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
