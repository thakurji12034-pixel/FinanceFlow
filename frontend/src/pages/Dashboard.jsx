import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { IndianRupee, TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sumRes, anaRes, insRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/analytics'),
          api.get('/dashboard/insights')
        ]);
        setSummary(sumRes.data);
        setAnalytics(anaRes.data);
        setInsights(insRes.data.insights);
      } catch (error) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Dashboard</h1>
          <p className="text-dark-muted mt-1">Here is your financial summary.</p>
        </div>
        <div className="flex items-center gap-3 bg-dark-card border border-dark-border px-4 py-2 rounded-xl">
          <Activity size={20} className={getScoreColor(summary?.healthScore)} />
          <div className="text-sm">
            <span className="text-dark-muted">Health Score: </span>
            <span className={`font-bold ${getScoreColor(summary?.healthScore)}`}>{summary?.healthScore || 0}/100</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 bg-gradient-to-br from-primary-600/20 to-primary-900/20 border-primary-500/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-primary-100/70 font-medium text-sm">Net Worth</p>
              <h3 className="text-3xl font-bold text-white mt-2">{formatCurrency(summary?.currentNetWorth)}</h3>
            </div>
            <div className="p-3 bg-primary-500/20 text-primary-400 rounded-lg">
              <IndianRupee size={24} />
            </div>
          </div>
          <p className="text-xs text-primary-400 mt-4 flex items-center gap-1">
            <TrendingUp size={14} />
            <span>Based on your assets and savings</span>
          </p>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-dark-muted font-medium text-sm">Total Balance</p>
              <h3 className="text-2xl font-bold text-white mt-2">{formatCurrency(summary?.totalBalance)}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
              <Wallet size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-dark-muted font-medium text-sm">Total Income</p>
              <h3 className="text-2xl font-bold text-green-500 mt-2">+{formatCurrency(summary?.totalIncome)}</h3>
            </div>
            <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-dark-muted font-medium text-sm">Total Expenses</p>
              <h3 className="text-2xl font-bold text-red-500 mt-2">-{formatCurrency(summary?.totalExpenses)}</h3>
            </div>
            <div className="p-3 bg-red-500/10 text-red-500 rounded-lg">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 lg:col-span-2 h-96">
          <h3 className="text-lg font-bold text-white mb-4">Cash Flow</h3>
          {analytics?.cashFlow && analytics.cashFlow.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.cashFlow} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${value / 1000}k`} />
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                />
                <Area type="monotone" dataKey="Income" stroke="#22c55e" fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="Expense" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-dark-muted">Not enough data to display chart</div>
          )}
        </div>
        
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Smart Insights</h3>
            <div className="space-y-4">
              {insights.length > 0 ? insights.map((insight, idx) => (
                <div key={idx} className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
                  <p className="text-sm text-primary-100">{insight}</p>
                </div>
              )) : (
                <div className="text-dark-muted text-sm text-center py-4">Keep tracking to unlock insights!</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
