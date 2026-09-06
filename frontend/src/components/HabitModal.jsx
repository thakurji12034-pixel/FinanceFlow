import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import api from '../services/api';

const HabitModal = ({ isOpen, onClose, habit, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'Daily',
    target: 1,
    reminder: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        description: habit.description || '',
        frequency: habit.frequency,
        target: habit.target,
        reminder: habit.reminder,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        frequency: 'Daily',
        target: 1,
        reminder: false,
      });
    }
  }, [habit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (habit) {
        await api.put(`/habits/${habit._id}`, formData);
      } else {
        await api.post('/habits', formData);
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
            {habit ? 'Edit Habit' : 'Create New Habit'}
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
            <label className="block text-sm font-medium text-dark-muted mb-1">Habit Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              placeholder="e.g. Save ₹100 everyday"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field min-h-[80px]"
              placeholder="Why are you building this habit?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-muted mb-1">Frequency</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="input-field"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              id="reminder"
              checked={formData.reminder}
              onChange={(e) => setFormData({ ...formData, reminder: e.target.checked })}
              className="w-4 h-4 text-primary-600 bg-dark-bg border-dark-border rounded focus:ring-primary-500 focus:ring-2"
            />
            <label htmlFor="reminder" className="text-sm font-medium text-dark-muted">
              Enable reminders for this habit
            </label>
          </div>

          <div className="pt-4 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border text-white rounded-lg font-medium hover:bg-dark-border transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 btn-primary flex justify-center">
              {isSubmitting ? <Loader2 className="animate-spin" /> : (habit ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;
