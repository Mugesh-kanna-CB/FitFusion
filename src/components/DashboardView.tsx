/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Dumbbell, 
  Apple, 
  ChevronRight, 
  Scale, 
  Ruler, 
  Activity, 
  User, 
  Sparkles, 
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Award
} from 'lucide-react';
import { User as UserType, FitnessDetails } from '../types';

interface DashboardViewProps {
  currentUser: UserType;
  fitnessDetails: FitnessDetails | null;
  onNavigateToTab: (tab: any) => void;
}

export default function DashboardView({ currentUser, fitnessDetails, onNavigateToTab }: DashboardViewProps) {
  
  // Custom helper to render healthy BMI indicators
  const getBmiAssessment = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-sky-500 bg-sky-500/10' };
    if (bmi < 25) return { text: 'Optimal / Green', color: 'text-emerald-500 bg-emerald-500/10' };
    if (bmi < 30) return { text: 'Overweight Range', color: 'text-amber-500 bg-amber-500/10' };
    return { text: 'Obese Class', color: 'text-rose-500 bg-rose-500/10' };
  };

  const currentInitials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  const defaultDetails: FitnessDetails = {
    user_id: currentUser?.id,
    age: 22,
    gender: 'Male',
    height: 175,
    weight: 72,
    goal: 'Maintain Fitness',
    bmi: 23.5,
  };

  const details = fitnessDetails || defaultDetails;
  const isDemo = !fitnessDetails;

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Demo Sandbox Alert Ribbon if profile is empty */}
      {isDemo && (
        <div id="demo-profile-ribbon" className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-bold">Demonstration Sandbox Mock Mode active:</span> You haven't declared your fitness credentials yet. Fill out the Fitness Form to see real-time updates! Showing standard demo stats for study below.
            </div>
          </div>
          <button
            id="dash-setup-btn"
            onClick={() => onNavigateToTab('fitness_form')}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer shrink-0 self-start sm:self-center"
          >
            Enter Metrics Now
          </button>
        </div>
      )}

      {/* Member welcome billboard card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-955 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-lg">
        {/* Decorative graphic patterns */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl -ml-24 -mb-24" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-indigo-400/15 border border-indigo-400/25 text-indigo-300 font-extrabold text-[10px] tracking-wider uppercase">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>FitFusion Dashboard Module</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, <span id="dash-user-name" className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-teal-200">{currentUser.name || 'User'}</span>!
            </h1>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
              Your personalized goal plan is locked and loaded. Update your profile at any time to keep calculations synched to Supabase storage.
            </p>
          </div>

          <div className="flex gap-4 self-start md:self-center bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm shrink-0">
            <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-md">
              {currentInitials}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase tracking-wider">Assigned Profile Target</span>
              <span id="dash-goal-label" className="text-sm font-bold text-slate-150 block mt-0.5">{details.goal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Age Stat Card */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">Age</span>
          <div id="dash-age-val" className="text-slate-800 font-black text-xl sm:text-2xl">{details.age} <span className="text-xs font-semibold text-slate-500">Yrs</span></div>
          <span className="text-[10px] text-indigo-500 hover:underline cursor-pointer block mt-1.5 font-medium" onClick={() => onNavigateToTab('fitness_form')}>Modify Metrics</span>
        </div>

        {/* Height Stat Card */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">Height</span>
          <div id="dash-height-val" className="text-slate-800 font-black text-xl sm:text-2xl">{details.height} <span className="text-xs font-semibold text-slate-500">cm</span></div>
          <div className="text-[10px] text-slate-500 block mt-1.5 font-medium flex items-center gap-0.5">
            <Ruler className="w-3.5 h-3.5 text-slate-400" />
            <span>{(details.height / 100).toFixed(2)} meters</span>
          </div>
        </div>

        {/* Weight Stat Card */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">Weight</span>
          <div id="dash-weight-val" className="text-slate-800 font-black text-xl sm:text-2xl">{details.weight} <span className="text-xs font-semibold text-slate-500">kg</span></div>
          <div className="text-[10px] text-slate-500 block mt-1.5 font-medium flex items-center gap-0.5">
            <Scale className="w-3.5 h-3.5 text-slate-400" />
            <span>{(details.weight * 2.2).toFixed(0)} lbs</span>
          </div>
        </div>

        {/* Calculated BMI Stat Card */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm text-left">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-0.5">Calculated BMI</span>
          <div id="dash-bmi-val" className="text-slate-800 font-black text-xl sm:text-2xl">{details.bmi}</div>
          <span className={`text-[9px] font-bold uppercase tracking-wider block mt-1.5 px-2 py-0.5 rounded-full w-fit ${getBmiAssessment(details.bmi).color}`}>
            {getBmiAssessment(details.bmi).text}
          </span>
        </div>

      </div>

      {/* Graphical Chart & Target Blueprints */}
      <div className="grid md:grid-cols-12 gap-6">
        
        {/* SVG Visualization Target Progress indicator */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-4.5 h-4.5 text-emerald-500" />
              Weight Target Spectrum Map
            </h3>
            <span className="text-[11px] text-indigo-500 hover:underline cursor-pointer" onClick={() => onNavigateToTab('bmi_calc')}>Launch Simulator</span>
          </div>

          <div className="relative py-4">
            {/* Custom interactive visual representation using responsive robust SVG mapping to represent optimal vs current weight */}
            <svg viewBox="0 0 400 120" className="w-full h-auto overflow-visible select-none">
              {/* Spectrum segments */}
              <rect x="0" y="45" width="100" height="15" rx="3" className="fill-sky-100 stroke-none" />
              <rect x="105" y="45" width="130" height="15" rx="3" className="fill-emerald-100 stroke-none" />
              <rect x="240" y="45" width="80" height="15" rx="3" className="fill-amber-100 stroke-none" />
              <rect x="325" y="45" width="75" height="15" rx="3" className="fill-rose-100 stroke-none" />

              {/* Text markings */}
              <text x="50" y="75" className="text-[10px] font-bold fill-sky-500 font-sans" textAnchor="middle">Under</text>
              <text x="170" y="75" className="text-[10px] font-bold fill-emerald-600 font-sans" textAnchor="middle">Normal Range</text>
              <text x="280" y="75" className="text-[10px] font-bold fill-amber-600 font-sans" textAnchor="middle">Overweight</text>
              <text x="362" y="75" className="text-[10px] font-bold fill-rose-500 font-sans" textAnchor="middle">Obese</text>

              {/* Dynamic status line pin */}
              {(() => {
                // Map BMI from 10 to 40 across the 400 SVG width index
                const bmiVal = Math.max(12, Math.min(38, details.bmi));
                const percentage = (bmiVal - 12) / (38 - 12);
                const xCoordinate = 20 + percentage * 360;
                return (
                  <g>
                    <line x1={xCoordinate} y1="15" x2={xCoordinate} y2="60" stroke="#4f46e5" strokeWidth="2.5" strokeDasharray="3,3" />
                    <circle cx={xCoordinate} cy="15" r="5" fill="#4f46e5" />
                    <rect x={xCoordinate - 32} y="0" width="64" height="24" rx="6" fill="#4f46e5" />
                    <text x={xCoordinate} y="15" className="text-[10px] font-sans font-extrabold fill-white" textAnchor="middle">BMI {details.bmi}</text>
                  </g>
                );
              })()}
            </svg>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] text-slate-550 leading-relaxed">
            <span className="font-bold text-slate-800">Assigned Plan Checklist:</span><br />
            {details.goal === 'Weight Loss' && 'You reside on a weight-loss priority diet (Oats, salad) to burn fat reserves safely.'}
            {details.goal === 'Muscle Gain' && 'You remain on an anabolic protein target (Eggs, Rice, Chicken) to trigger deep muscle fiber growth.'}
            {details.goal === 'Maintain Fitness' && 'You are focused on lifestyle endurance (Balanced Diet) to secure optimal joint wellness.'}
          </div>
        </div>

        {/* Sidebar recommendations shortcut billboard */}
        <div className="md:col-span-5 space-y-4">
          
          {/* Workout Recommendation preview card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                <Dumbbell className="w-4 h-4 text-indigo-500" />
                <span>Workout Suggestion</span>
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm">
                {details.goal === 'Weight Loss' && 'Running, Jump Rope, Cycling'}
                {details.goal === 'Muscle Gain' && 'Pushups, Squats, Dumbbell lifts'}
                {details.goal === 'Maintain Fitness' && 'Walking, Stretching, Core lifts'}
              </h4>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Suggested active routines mapped specifically to your selected profile goal.
              </p>
            </div>
            
            <button
              onClick={() => onNavigateToTab('recommendations')}
              className="flex items-center gap-1 text-xs text-indigo-600 font-bold mt-2 hover:text-indigo-700 transition cursor-pointer"
            >
              <span>Explore Exercises</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Diet Recommendation preview card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-40">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">
                <Apple className="w-4 h-4 text-indigo-500" />
                <span>Diet Suggestion</span>
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm">
                {details.goal === 'Weight Loss' && 'Oats, Fruits, Salad'}
                {details.goal === 'Muscle Gain' && 'Eggs, Milk, Rice, Chicken'}
                {details.goal === 'Maintain Fitness' && 'Balanced Meals & Hydration'}
              </h4>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                Optimal recovery macronutrients mapped specifically to fuel your target.
              </p>
            </div>
            
            <button
              onClick={() => onNavigateToTab('recommendations')}
              className="flex items-center gap-1 text-xs text-indigo-600 font-bold mt-2 hover:text-indigo-700 transition cursor-pointer"
            >
              <span>See Diet Prep Details</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
