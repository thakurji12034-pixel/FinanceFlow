import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Bell, Search, User, LogOut, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notification read");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-dark-bg border-b border-dark-border flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions, goals..." 
            className="w-full bg-dark-card border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-white placeholder-dark-muted"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-6 relative" ref={dropdownRef}>
        <div className="relative cursor-pointer" onClick={() => setShowNotifications(!showNotifications)}>
          <Bell className="text-dark-muted hover:text-white transition-colors" size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-dark-bg">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute top-10 right-16 w-80 bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden z-50">
            <div className="p-3 border-b border-dark-border flex justify-between items-center bg-dark-bg">
              <h4 className="font-bold text-white text-sm">Notifications</h4>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-dark-muted text-sm">No notifications</div>
              ) : (
                notifications.map(notif => (
                  <div key={notif._id} className={`p-4 border-b border-dark-border/50 hover:bg-dark-bg/50 transition-colors flex justify-between gap-3 ${!notif.read ? 'bg-primary-500/5' : ''}`}>
                    <div>
                      <p className={`text-sm ${!notif.read ? 'font-medium text-white' : 'text-dark-muted'}`}>{notif.message}</p>
                      <p className="text-xs text-dark-muted mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                    </div>
                    {!notif.read && (
                      <button onClick={(e) => { e.stopPropagation(); markAsRead(notif._id); }} className="text-primary-500 hover:text-primary-400 shrink-0">
                        <Check size={16} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Link to="/profile" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-bold group-hover:ring-2 group-hover:ring-primary-500/50 transition-all">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-white hidden md:block group-hover:text-primary-400 transition-colors">{user?.name}</span>
          </Link>
          <div className="w-px h-6 bg-dark-border ml-2"></div>
          <button onClick={handleLogout} className="text-dark-muted hover:text-red-500 transition-colors ml-2" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
