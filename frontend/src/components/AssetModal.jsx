import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';

const AssetModal = ({ isOpen, onClose, asset, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Stocks',
    investedAmount: '',
    currentValue: '',
    purchaseDate: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name,
        type: asset.type,
        investedAmount: asset.investedAmount,
        currentValue: asset.currentValue,
        purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate).toISOString().split('T')[0] : '',
        notes: asset.notes || '',
      });
    } else {
      setFormData({
        name: '',
        type: 'Stocks',
        investedAmount: '',
        currentValue: '',
        purchaseDate: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [asset, isOpen]);

  if (!isOpen) return null;

  const types = ['Stocks', 'Mutual Funds', 'Fixed Deposits', 'Gold', 'Crypto', 'Real Estate', 'Other Assets'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (asset) {
        await api.put(`/assets/${asset._id}`, formData);
      } else {
        await api.post('/assets', formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-dark-card border border-dark-border rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {asset ? 'Edit Asset' : 'Add New Asset'}
          </h2>
          <button onClick={onClose} className="text-dark-muted hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1">Asset Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g. Apple Stock"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1">Asset Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="input-field"
            >
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-muted mb-1">Invested Amount (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.investedAmount}
                onChange={(e) => setFormData({ ...formData, investedAmount: e.target.value })}
                className="input-field"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-muted mb-1">Current Value (₹)</label>
              <input
                type="number"
                required
                min="0"
                value={formData.currentValue}
                onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
                className="input-field"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1">Purchase Date</label>
            <input
              type="date"
              required
              value={formData.purchaseDate}
              onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1">Notes (Optional)</label>
            <input
              type="text"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input-field"
              placeholder="Any details..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border text-white rounded-lg font-medium hover:bg-dark-border transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary flex justify-center">
              {isSubmitting ? <Loader2 className="animate-spin" /> : (asset ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssetModal;
