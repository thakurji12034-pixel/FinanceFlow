import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../services/api';
import { Users, Activity, ShieldAlert, CheckCircle, Database } from 'lucide-react';

const Admin = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const fetchAdminData = async () => {
      try {
        const [usersRes, analyticsRes] = await Promise.all([
          api.get('/admin/users'),
          api.get('/admin/analytics')
        ]);
        setUsers(usersRes.data);
        setAnalytics(analyticsRes.data);
      } catch (error) {
        console.error("Error fetching admin data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAdminData();
  }, [user]);

  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="text-primary-500" />
            Admin Dashboard
          </h1>
          <p className="text-dark-muted mt-1">Platform overview and user management.</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-dark-muted font-medium text-sm">Total Users</p>
              <h3 className="text-3xl font-bold text-white mt-2">{analytics?.totalUsers || 0}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
              <Users size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6 border-l-4 border-l-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-dark-muted font-medium text-sm">Total Transactions</p>
              <h3 className="text-3xl font-bold text-white mt-2">{analytics?.totalTransactions || 0}</h3>
            </div>
            <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
              <Activity size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6 border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-dark-muted font-medium text-sm">Active Habits</p>
              <h3 className="text-3xl font-bold text-white mt-2">{analytics?.totalHabits || 0}</h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6 border-l-4 border-l-orange-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-dark-muted font-medium text-sm">Savings Goals</p>
              <h3 className="text-3xl font-bold text-white mt-2">{analytics?.totalGoals || 0}</h3>
            </div>
            <div className="p-3 bg-orange-500/10 text-orange-500 rounded-lg">
              <Database size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-white mb-4">User Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-dark-muted border-b border-dark-border">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-dark-border/50 hover:bg-dark-bg/50 transition-colors">
                  <td className="py-4 font-medium text-white">{u.name}</td>
                  <td className="py-4 text-dark-muted">{u.email}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-md ${u.role === 'admin' ? 'bg-primary-500/20 text-primary-500' : 'bg-dark-bg border border-dark-border text-dark-muted'}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 text-dark-muted">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
