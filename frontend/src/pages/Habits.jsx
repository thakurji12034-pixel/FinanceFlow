import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, CheckCircle2, Flame, Trophy, Trash2, Edit2, Sword } from 'lucide-react';
import HabitModal from '../components/HabitModal';

const Habits = () => {
  const [activeTab, setActiveTab] = useState('habits'); // 'habits' or 'challenges'
  const [habits, setHabits] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'habits') {
        const { data } = await api.get('/habits');
        setHabits(data);
      } else {
        const { data } = await api.get('/challenges');
        setChallenges(data);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await api.delete(`/habits/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting habit", error);
      }
    }
  };

  const handleEdit = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const handleComplete = async (id) => {
    try {
      await api.post(`/habits/${id}/complete`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to complete habit');
    }
  };

  const joinSampleChallenge = async () => {
    try {
      await api.post('/challenges', {
        name: 'No Spend Weekend',
        description: 'Do not spend any money on non-essentials this weekend.',
        target: 2,
        days: 2
      });
      fetchData();
    } catch (error) {
      alert('Failed to join challenge');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Discipline & Consistency</h1>
          <p className="text-dark-muted mt-1">Build financial habits and take on challenges.</p>
        </div>
        {activeTab === 'habits' && (
          <button 
            onClick={() => { setEditingHabit(null); setIsModalOpen(true); }}
            className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <Plus size={20} />
            <span>New Habit</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-dark-border">
        <button
          onClick={() => setActiveTab('habits')}
          className={`pb-3 font-medium transition-colors relative ${activeTab === 'habits' ? 'text-primary-500' : 'text-dark-muted hover:text-white'}`}
        >
          My Habits
          {activeTab === 'habits' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-t-full"></div>}
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`pb-3 font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'challenges' ? 'text-orange-500' : 'text-dark-muted hover:text-white'}`}
        >
          <Sword size={16} />
          Challenges
          {activeTab === 'challenges' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-full"></div>}
        </button>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'habits' ? (
        habits.length === 0 ? (
          <div className="card p-12 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-primary-500/10 text-primary-500 rounded-full flex items-center justify-center mb-4">
              <Trophy size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No habits yet</h3>
            <p className="text-dark-muted max-w-sm mb-6">Start building better financial discipline by creating your first habit today.</p>
            <button onClick={() => { setEditingHabit(null); setIsModalOpen(true); }} className="btn-primary">
              Create your first habit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map((habit) => (
              <div key={habit._id} className="card p-6 flex flex-col h-full hover:border-primary-500/50 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 text-xs font-medium rounded-md ${
                      habit.frequency === 'Daily' ? 'bg-blue-500/20 text-blue-400' :
                      habit.frequency === 'Weekly' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-orange-500/20 text-orange-400'
                    }`}>
                      {habit.frequency}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(habit)} className="p-1.5 text-dark-muted hover:text-white hover:bg-dark-border rounded-lg transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(habit._id)} className="p-1.5 text-dark-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1">{habit.name}</h3>
                {habit.description && (
                  <p className="text-sm text-dark-muted line-clamp-2 mb-4 flex-1">{habit.description}</p>
                )}
                
                <div className="mt-auto pt-6">
                  <div className="flex justify-between items-center mb-4 bg-dark-bg p-3 rounded-xl border border-dark-border">
                    <div className="flex items-center gap-2">
                      <Flame className={habit.streak > 0 ? "text-orange-500" : "text-dark-muted"} size={20} />
                      <div>
                        <p className="text-xs text-dark-muted">Current Streak</p>
                        <p className="text-lg font-bold text-white">{habit.streak} <span className="text-sm font-normal text-dark-muted">days</span></p>
                      </div>
                    </div>
                    <div className="h-8 w-px bg-dark-border"></div>
                    <div>
                      <p className="text-xs text-dark-muted text-right">Best</p>
                      <p className="text-sm font-bold text-white text-right">{habit.longestStreak}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleComplete(habit._id)}
                    className="w-full py-2.5 rounded-lg font-medium border border-primary-500/50 bg-primary-500/10 text-primary-400 hover:bg-primary-500 hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    <span>Mark Completed</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        challenges.length === 0 ? (
          <div className="card p-12 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mb-4">
              <Sword size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Ready for a challenge?</h3>
            <p className="text-dark-muted max-w-sm mb-6">Push your financial limits by participating in community challenges.</p>
            <button onClick={joinSampleChallenge} className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg font-medium transition-colors">
              Join "No Spend Weekend"
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <div key={challenge._id} className="card p-6 border-t-4 border-t-orange-500">
                <h3 className="text-xl font-bold text-white mb-2">{challenge.name}</h3>
                <p className="text-sm text-dark-muted mb-4">{challenge.description}</p>
                <div className="bg-dark-bg p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-xs text-dark-muted">Progress</p>
                    <p className="text-lg font-bold text-white">{challenge.progress} / {challenge.target}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-dark-muted">Ends In</p>
                    <p className="text-sm font-medium text-orange-400">
                      {Math.ceil((new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      <HabitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        habit={editingHabit}
        onSuccess={fetchData}
      />
    </div>
  );
};

export default Habits;
