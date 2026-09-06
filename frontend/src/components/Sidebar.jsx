import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Receipt, RefreshCcw, Target, TrendingUp, Settings, LogOut, Shield } from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <Receipt size={20} /> },
    { name: 'Habits', path: '/habits', icon: <RefreshCcw size={20} /> },
    { name: 'Goals', path: '/goals', icon: <Target size={20} /> },
    { name: 'Wealth', path: '/wealth', icon: <TrendingUp size={20} /> },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin', path: '/admin', icon: <Shield size={20} /> });
  }

  return (
    <aside className="w-64 bg-dark-card border-r border-dark-border h-screen flex flex-col fixed top-0 left-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-500 flex items-center gap-2">
          <TrendingUp className="text-primary-500" />
          FinanceFlow
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-primary-500/10 text-primary-500'
                  : 'text-dark-muted hover:bg-dark-bg hover:text-dark-text'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-dark-border space-y-2">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark-muted hover:bg-dark-bg hover:text-dark-text w-full transition-all">
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 w-full transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
