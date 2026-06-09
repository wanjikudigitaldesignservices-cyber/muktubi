import { useState } from 'react';
import { X, UserPlus, Loader2 } from 'lucide-react';
import { onboardMember } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface AddMemberModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddMemberModal({ onClose, onSuccess }: AddMemberModalProps) {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'student',
    grade_level: '',
    reading_level: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onboardMember({
        ...formData,
        password: 'password123',
        center_id: profile?.center_id
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to onboard member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--mohi-green-100)] text-[var(--mohi-green)] flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Onboard Member</h2>
              <p className="text-xs text-slate-500 font-medium">Add a teacher or student</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-2 bg-white rounded-full shadow-sm">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--mohi-green)] focus:border-transparent outline-none transition-all text-slate-900 font-medium"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="e.g. David Ochieng"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--mohi-green)] focus:border-transparent outline-none transition-all text-slate-900 font-medium"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="david@mohiafrica.org"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Role</label>
              <select
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--mohi-green)] focus:border-transparent outline-none transition-all text-slate-900 font-medium appearance-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Grade Level</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--mohi-green)] focus:border-transparent outline-none transition-all text-slate-900 font-medium"
                  value={formData.grade_level}
                  onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
                  placeholder="e.g. 4"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reading Level</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[var(--mohi-green)] focus:border-transparent outline-none transition-all text-slate-900 font-medium"
                  value={formData.reading_level}
                  onChange={(e) => setFormData({ ...formData, reading_level: e.target.value })}
                  placeholder="e.g. Beginner"
                />
              </div>
            </div>
            
            <div className="pt-2 text-xs text-slate-500 italic text-center">
              A default password of <span className="font-bold text-slate-700">password123</span> will be assigned.
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-[var(--mohi-green)] hover:bg-[var(--mohi-green-dark)] text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_0_rgba(27,94,32,0.39)] hover:shadow-[0_6px_20px_rgba(27,94,32,0.23)] hover:-translate-y-0.5 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
