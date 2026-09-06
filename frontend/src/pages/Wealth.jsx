import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, TrendingUp, TrendingDown, Edit2, Trash2, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import AssetModal from '../components/AssetModal';

const Wealth = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);

  const fetchAssets = async () => {
    try {
      const { data } = await api.get('/assets');
      setAssets(data);
    } catch (error) {
      console.error("Error fetching assets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.delete(`/assets/${id}`);
        fetchAssets();
      } catch (error) {
        console.error("Error deleting asset", error);
      }
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setIsModalOpen(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalInvested = assets.reduce((sum, asset) => sum + asset.investedAmount, 0);
  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalProfitLoss = totalValue - totalInvested;
  const profitLossPercentage = totalInvested > 0 ? (totalProfitLoss / totalInvested) * 100 : 0;

  // Chart Data preparation
  const allocationData = [];
  const typeMap = {};
  
  assets.forEach(asset => {
    if (!typeMap[asset.type]) typeMap[asset.type] = 0;
    typeMap[asset.type] += asset.currentValue;
  });

  Object.keys(typeMap).forEach(key => {
    allocationData.push({ name: key, value: typeMap[key] });
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  const performanceData = assets.map(asset => ({
    name: asset.name,
    Invested: asset.investedAmount,
    Current: asset.currentValue
  })).slice(0, 5); // top 5

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Wealth & Assets</h1>
          <p className="text-dark-muted mt-1">Track your investments and portfolio growth.</p>
        </div>
        <button 
          onClick={() => { setEditingAsset(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <Plus size={20} />
          <span>Add Asset</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6">
              <p className="text-dark-muted font-medium text-sm">Total Invested</p>
              <h3 className="text-2xl font-bold text-white mt-2">{formatCurrency(totalInvested)}</h3>
            </div>
            <div className="card p-6">
              <p className="text-dark-muted font-medium text-sm">Current Portfolio Value</p>
              <h3 className="text-2xl font-bold text-white mt-2">{formatCurrency(totalValue)}</h3>
            </div>
            <div className="card p-6 bg-gradient-to-br from-dark-card to-dark-bg">
              <p className="text-dark-muted font-medium text-sm">Total Returns</p>
              <div className="flex items-center gap-3 mt-2">
                <h3 className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {totalProfitLoss >= 0 ? '+' : ''}{formatCurrency(totalProfitLoss)}
                </h3>
                <div className={`px-2 py-1 rounded-md text-xs font-bold ${totalProfitLoss >= 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {totalProfitLoss >= 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6 h-96">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <PieChartIcon size={20} className="text-primary-500" />
                Asset Allocation
              </h3>
              {allocationData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={allocationData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {allocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-dark-muted">No assets to display</div>
              )}
            </div>

            <div className="card p-6 h-96">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-500" />
                Top Performers
              </h3>
              {performanceData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" tickFormatter={(value) => `₹${value / 1000}k`} />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                      cursor={{ fill: '#334155', opacity: 0.4 }}
                    />
                    <Legend />
                    <Bar dataKey="Invested" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Current" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-dark-muted">No assets to display</div>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-bold text-white mb-4">Your Portfolio</h3>
            {assets.length === 0 ? (
              <div className="text-center py-8 text-dark-muted">
                No assets added yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-dark-muted border-b border-dark-border">
                      <th className="pb-3 font-medium">Asset Name</th>
                      <th className="pb-3 font-medium">Type</th>
                      <th className="pb-3 font-medium text-right">Invested</th>
                      <th className="pb-3 font-medium text-right">Current Value</th>
                      <th className="pb-3 font-medium text-right">Returns</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => {
                      const pl = asset.currentValue - asset.investedAmount;
                      const plPct = asset.investedAmount > 0 ? (pl / asset.investedAmount) * 100 : 0;
                      return (
                        <tr key={asset._id} className="border-b border-dark-border/50 hover:bg-dark-bg/50 transition-colors">
                          <td className="py-4 font-medium text-white">{asset.name}</td>
                          <td className="py-4 text-dark-muted">{asset.type}</td>
                          <td className="py-4 text-right text-dark-muted">{formatCurrency(asset.investedAmount)}</td>
                          <td className="py-4 text-right font-medium text-white">{formatCurrency(asset.currentValue)}</td>
                          <td className="py-4 text-right">
                            <div className={`font-medium ${pl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {pl >= 0 ? '+' : ''}{formatCurrency(pl)}
                              <span className="text-xs ml-1 opacity-80">({pl >= 0 ? '+' : ''}{plPct.toFixed(1)}%)</span>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => handleEdit(asset)} className="p-2 text-dark-muted hover:text-white hover:bg-dark-border rounded-lg transition-colors">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDelete(asset._id)} className="p-2 text-dark-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      <AssetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        asset={editingAsset}
        onSuccess={fetchAssets}
      />
    </div>
  );
};

export default Wealth;
