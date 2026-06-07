import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../lib/api';
import { User, Lock, Save, AlertCircle, Check } from 'lucide-react';
export function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    dateOfBirth: user?.dateOfBirth || '',
  });
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await authApi.updateProfile(profile);
      setMessage('Profile updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await authApi.changePassword(passwords);
      setMessage('Password changed successfully');
      setPasswords({ oldPassword: '', newPassword: '' });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Account Settings</h1>
      {message && <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center gap-2"><Check size={20}/> {message}</div>}
      {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2"><AlertCircle size={20}/> {error}</div>}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 text-[#00502D]">
            <User size={24} />
            <h2 className="text-xl font-semibold">Personal Information</h2>
          </div>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={profile.firstName}
                onChange={e => setProfile({...profile, firstName: e.target.value})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#00502D] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={profile.lastName}
                onChange={e => setProfile({...profile, lastName: e.target.value})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#00502D] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={profile.dateOfBirth}
                onChange={e => setProfile({...profile, dateOfBirth: e.target.value})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#00502D] outline-none"
              />
            </div>
            <button type="submit" className="flex items-center gap-2 bg-[#00502D] text-white px-4 py-2 rounded-lg hover:bg-[#003c22] transition-colors">
              <Save size={18} /> Save Changes
            </button>
          </form>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 text-[#00502D]">
            <Lock size={24} />
            <h2 className="text-xl font-semibold">Change Password</h2>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwords.oldPassword}
                onChange={e => setPasswords({...passwords, oldPassword: e.target.value})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#00502D] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={passwords.newPassword}
                onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-[#00502D] outline-none"
              />
            </div>
            <button type="submit" className="flex items-center gap-2 bg-[#00502D] text-white px-4 py-2 rounded-lg hover:bg-[#003c22] transition-colors">
              <Save size={18} /> Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
