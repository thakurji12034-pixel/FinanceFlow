import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { User, Mail, Shield, Loader2, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const updateData = { name: formData.name, email: formData.email };
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      const res = await api.put('/profile', updateData);
      
      // Update local storage user data
      const currentToken = localStorage.getItem('token');
      localStorage.setItem('user', JSON.stringify(res.data));
      
      setSuccess(true);
      setFormData(prev => ({ ...prev, password: '' }));
      
      setTimeout(() => {
        window.location.reload(); // Quick way to sync auth context with new name
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-dark-muted mt-1">Manage your account details and security.</p>
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-dark-border">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-dark-muted">{user?.role === 'admin' ? 'Administrator' : 'Standard User'}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-500 text-sm flex items-center gap-2">
            <CheckCircle2 size={18} />
            <span>Profile updated successfully! Refreshing...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <User size={18} className="text-primary-500" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-muted mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-muted mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={16} />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-dark-border">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Shield size={18} className="text-primary-500" />
              Security
            </h3>
            <div>
              <label className="block text-sm font-medium text-dark-muted mb-1">New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="input-field max-w-md"
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full md:w-auto min-w-[150px] flex justify-center"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
