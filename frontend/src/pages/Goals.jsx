import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Target, Trash2, Edit2, CheckCircle2, TrendingUp } from 'lucide-react';
import GoalModal from '../components/GoalModal';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const fetchGoals = async () => {
    try {
      const { data } = await api.get('/goals');
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await api.delete(`/goals/${id}`);
        fetchGoals();
      } catch (error) {
        console.error("Error deleting goal", error);
      }
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleContribute = async (goal) => {
    const contributionStr = window.prompt(`Enter amount to contribute to '${goal.name}':`);
    if (contributionStr) {
      const amount = parseFloat(contributionStr);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
      try {
        await api.post(`/goals/${goal._id}/contribute`, { amount });
        fetchGoals();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to add contribution');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Savings Goals</h1>
          <p className="text-dark-muted mt-1">Track and achieve your financial targets.</p>
        </div>
        <button 
          onClick={() => { setEditingGoal(null); setIsModalOpen(true); }}
          className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <Plus size={20} />
          <span>New Goal</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : goals.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center">
          <div className="h-16 w-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <Target size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No goals set yet</h3>
          <p className="text-dark-muted max-w-sm mb-6">Start planning for your future by setting up a savings goal like an Emergency Fund.</p>
          <button 
            onClick={() => { setEditingGoal(null); setIsModalOpen(true); }}
            className="btn-primary"
          >
            Create your first goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const isCompleted = goal.status === 'Completed';

            return (
              <div key={goal._id} className="card p-6 flex flex-col h-full hover:border-blue-500/50 transition-colors group relative overflow-hidden">
                {isCompleted && (
                  <div className="absolute top-0 right-0 p-4 bg-green-500/10 rounded-bl-3xl">
                    <CheckCircle2 className="text-green-500" size={24} />
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <div className="px-2 py-1 bg-dark-bg text-dark-muted text-xs font-medium rounded-md border border-dark-border">
                    {goal.category}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(goal)} className="p-1.5 text-dark-muted hover:text-white hover:bg-dark-border rounded-lg transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(goal._id)} className="p-1.5 text-dark-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{goal.name}</h3>
                <p className="text-sm text-dark-muted mb-6">
                  {goal.deadline ? `Target: ${new Date(goal.deadline).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}` : 'No specific deadline'}
                </p>

                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className="text-2xl font-bold text-white">{formatCurrency(goal.currentAmount)}</p>
                      <p className="text-xs text-dark-muted">of {formatCurrency(goal.targetAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-500">{progress}%</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-dark-bg rounded-full h-2.5 mb-6 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`} 
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  {!isCompleted && (
                    <button 
                      onClick={() => handleContribute(goal)}
                      className="w-full py-2.5 rounded-lg font-medium border border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <TrendingUp size={18} />
                      <span>Add Contribution</span>
                    </button>
                  )}
                  
                  {isCompleted && (
                    <div className="w-full py-2.5 rounded-lg font-medium bg-green-500/10 text-green-500 text-center">
                      Goal Achieved! 🎉
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GoalModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        goal={editingGoal}
        onSuccess={fetchGoals}
      />
    </div>
  );
};

export default Goals;
