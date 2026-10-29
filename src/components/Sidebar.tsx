/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  UserSquare2, 
  Calculator, 
  Cpu, 
  User, 
  Database,
  LogOut, 
  Menu, 
  X,
  Dumbbell
} from 'lucide-react';
import { User as UserType } from '../types';

export type SidebarTab = 'dashboard' | 'fitness_form' | 'bmi_calc' | 'recommendations' | 'profile' | 'sql_schema';

interface SidebarProps {
  currentTab: SidebarTab;
  onChangeTab: (tab: SidebarTab) => void;
  currentUser: UserType;
  onLogout: () => void;
}

export default function Sidebar({ currentTab, onChangeTab, currentUser, onLogout }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'fitness_form', label: 'Fitness Form', icon: UserSquare2 },
    { id: 'bmi_calc', label: 'BMI Calculator', icon: Calculator },
    { id: 'recommendations', label: 'Recommendations', icon: Cpu },
    { id: 'profile', label: 'Profile Page', icon: User },
    { id: 'sql_schema', label: 'Database & SQL', icon: Database },
  ] as const;

  const navigateTo = (tab: SidebarTab) => {
    onChangeTab(tab);
    setMobileOpen(false);
  };

  const currentInitials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      {/* Mobile Top Header Navigation Bar */}
      <header className="lg:hidden h-16 w-full bg-slate-900 border-b border-slate-800 text-slate-100 px-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Dumbbell className="w-6 h-6 text-indigo-400" />
          <span className="font-extrabold tracking-tight text-lg text-white">FitFusion</span>
        </div>
        <button
          id="mobile-menu-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg text-slate-300 hover:text-white cursor-pointer"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Backdrop overlay for mobile */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Shell */}
      <aside className={`
        fixed inset-y-0 left-0 bg-slate-900 text-slate-100 w-80 transform transition-transform duration-300 z-50 flex flex-col justify-between border-r border-slate-800
        lg:translate-x-0 lg:static lg:h-screen lg:w-72 shrink-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Brand Container */}
        <div>
          <div className="hidden lg:flex items-center gap-3 px-6 py-6 border-b border-slate-800">
            <div className="p-2 bg-indigo-500 rounded-lg text-white font-bold flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-xl text-white">FitFusion</span>
              <div className="text-[10px] text-indigo-450 font-medium tracking-widest uppercase">Fitness Blueprint</div>
            </div>
          </div>

          {/* User Preview */}
          <div className="p-4 mx-4 mt-6 bg-slate-800/40 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-white text-sm shadow-md">
              {currentInitials}
            </div>
            <div className="overflow-hidden">
              <div className="font-semibold text-slate-200 text-sm truncate">{currentUser.name}</div>
              <div className="text-xs text-slate-400 truncate">{currentUser.email}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => navigateTo(item.id)}
                  className={`
                    w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
                    ${isActive 
                      ? 'bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-900/20' 
                      : 'text-slate-400 hover:text-slate-105 hover:text-slate-200 hover:bg-slate-800'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Info & SignOut */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <button
            id="nav-logout"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-850 hover:bg-rose-500/10 hover:text-rose-400 border border-slate-800 hover:border-rose-500/20 rounded-xl text-xs font-semibold text-slate-400 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
          

        </div>

      </aside>
    </>
  );
}
