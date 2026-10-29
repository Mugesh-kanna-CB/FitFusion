/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { authService, fitnessService, isSupabaseConfigured } from './supabaseClient';
import { User, FitnessDetails } from './types';
import AuthView from './components/AuthView';
import Sidebar, { SidebarTab } from './components/Sidebar';
import DashboardView from './components/DashboardView';
import FitnessFormView from './components/FitnessFormView';
import BmiCalculatorView from './components/BmiCalculatorView';
import RecommendationsView from './components/RecommendationsView';
import ProfileView from './components/ProfileView';
import SqlSchemaView from './components/SqlSchemaView';
import { Dumbbell, ShieldAlert, Wifi, Info } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [fitnessDetails, setFitnessDetails] = useState<FitnessDetails | null>(null);
  const [currentTab, setCurrentTab] = useState<SidebarTab>('dashboard');
  const [loading, setLoading] = useState(true);

  // Check user session on initial mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          // Load their fitness records as well if they exist
          const { details } = await fitnessService.getDetails(user.id);
          if (details) {
            setFitnessDetails(details);
          }
        }
      } catch (err) {
        console.error('Session check failed', err);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const handleAuthSuccess = async (user: User) => {
    setCurrentUser(user);
    setLoading(true);
    try {
      const { details } = await fitnessService.getDetails(user.id);
      if (details) {
        setFitnessDetails(details);
      } else {
        setFitnessDetails(null);
      }
    } catch (err) {
      console.error('Failed to load fitness stats', err);
    } finally {
      setLoading(false);
      // Direct them to dashboard
      setCurrentTab('dashboard');
    }
  };

  const handleSaveFitnessDetails = (updated: FitnessDetails) => {
    setFitnessDetails(updated);
  };

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    setFitnessDetails(null);
    setCurrentTab('dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-white font-sans">
        <Dumbbell className="w-12 h-12 text-emerald-400 animate-bounce mb-4" />
        <p className="text-sm font-semibold tracking-wide text-slate-400">Loading FitFusion Core Blueprint...</p>
      </div>
    );
  }

  // If user is not authenticated, render auth portal (Login + Register)
  if (!currentUser) {
    return (
      <div className="relative min-h-screen">
        <AuthView onAuthSuccess={handleAuthSuccess} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      
      {/* Sidebar Navigation Panel */}
      <Sidebar 
        currentTab={currentTab} 
        onChangeTab={setCurrentTab} 
        currentUser={currentUser} 
        onLogout={handleLogout} 
      />

      {/* Main content workspace scroll container */}
      <main className="flex-1 flex flex-col min-h-screen lg:h-screen lg:overflow-y-auto">
        
        {/* Top Mini status bar */}
        <div className="bg-white border-b border-slate-100 py-3 px-6 sm:px-8 hidden lg:flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span>Status:</span>
            {isSupabaseConfigured ? (
              <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                <Wifi className="w-3.5 h-3.5" />
                Supabase Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full font-bold">
                <Info className="w-3.5 h-3.5" />
                Dynamic Local Sandbox Fallback
              </span>
            )}
          </div>


        </div>

        {/* Content Viewer viewport */}
        <div className="p-6 sm:p-8 flex-1">
          {currentTab === 'dashboard' && (
            <DashboardView 
              currentUser={currentUser} 
              fitnessDetails={fitnessDetails} 
              onNavigateToTab={setCurrentTab} 
            />
          )}

          {currentTab === 'fitness_form' && (
            <FitnessFormView 
              userId={currentUser.id} 
              existingDetails={fitnessDetails} 
              onSaveSuccess={handleSaveFitnessDetails} 
            />
          )}

          {currentTab === 'bmi_calc' && (
            <BmiCalculatorView 
              userHeight={fitnessDetails?.height} 
              userWeight={fitnessDetails?.weight} 
            />
          )}

          {currentTab === 'recommendations' && (
            <RecommendationsView 
              userGoal={fitnessDetails?.goal || 'Maintain Fitness'} 
            />
          )}

          {currentTab === 'profile' && (
            <ProfileView 
              currentUser={currentUser} 
              fitnessDetails={fitnessDetails} 
              onNavigateToForm={() => setCurrentTab('fitness_form')} 
            />
          )}

          {currentTab === 'sql_schema' && (
            <SqlSchemaView />
          )}
        </div>

      </main>

    </div>
  );
}
