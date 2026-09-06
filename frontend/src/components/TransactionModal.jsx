import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';

const TransactionModal = ({ isOpen, onClose, transaction, onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'Expense',
    amount: '',
    category: 'Food',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: new Date(transaction.date).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        type: 'Expense',
        amount: '',
        category: 'Food',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [transaction, isOpen]);

  if (!isOpen) return null;

  const incomeCategories = ['Salary', 'Freelance', 'Scholarship', 'Business', 'Other'];
  const expenseCategories = ['Food', 'Transport', 'Rent', 'Education', 'Shopping', 'Entertainment', 'Healthcare', 'Utilities', 'Bills', 'Travel', 'Other'];

  const categories = formData.type === 'Income' ? incomeCategories : expenseCategories;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (transaction) {
        await api.put(`/transactions/${transaction._id}`, formData);
      } else {
        await api.post('/transactions', formData);
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
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
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
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'Income', category: 'Salary' })}
              className={`py-2 rounded-lg font-medium border transition-colors ${
                formData.type === 'Income'
                  ? 'bg-green-500/20 border-green-500/50 text-green-500'
                  : 'bg-dark-bg border-dark-border text-dark-muted hover:border-dark-muted'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, type: 'Expense', category: 'Food' })}
              className={`py-2 rounded-lg font-medium border transition-colors ${
                formData.type === 'Expense'
                  ? 'bg-red-500/20 border-red-500/50 text-red-500'
                  : 'bg-dark-bg border-dark-border text-dark-muted hover:border-dark-muted'
              }`}
            >
              Expense
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1">Amount (₹)</label>
            <input
              type="number"
              required
              min="1"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="input-field"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1">Description</label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field"
              placeholder="What was this for?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1">Date</label>
            <input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border text-white rounded-lg font-medium hover:bg-dark-border transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary flex justify-center">
              {isSubmitting ? <Loader2 className="animate-spin" /> : (transaction ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
