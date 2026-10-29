/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { User, Activity, Dumbbell, Apple, Layers, ShieldCheck, Mail, Calendar, ArrowRight } from 'lucide-react';
import { User as UserType, FitnessDetails } from '../types';

interface ProfileViewProps {
  currentUser: UserType;
  fitnessDetails: FitnessDetails | null;
  onNavigateToForm: () => void;
}

export default function ProfileView({ currentUser, fitnessDetails, onNavigateToForm }: ProfileViewProps) {
  const currentInitials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  const getBmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Underweight', color: 'bg-sky-50 text-sky-700 border-sky-100' };
    if (bmi < 25) return { text: 'Normal Range', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    if (bmi < 30) return { text: 'Overweight', color: 'bg-amber-50 text-amber-700 border-amber-100' };
    return { text: 'Obese', color: 'bg-rose-50 text-rose-700 border-rose-100' };
  };

  const getGoalTheme = (g: string) => {
    switch (g) {
      case 'Weight Loss':
        return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Muscle Gain':
        return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      default:
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title block */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-500" />
            My Member Profile
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Displaying your credentials, account metadata, and complete system health recommendations overview.
          </p>
        </div>
        <div className="text-slate-500 text-xs font-mono font-medium opacity-80 shrink-0 self-start sm:self-center">
          ID: {currentUser.id}
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* User identification credentials */}
        <div className="md:col-span-4 bg-white border border-slate-100 rounded-2xl shadow-sm p-6 flex flex-col items-center justify-between min-h-[340px]">
          <div className="text-center w-full">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-white text-2xl shadow-lg mx-auto mb-4 border-4 border-slate-50">
              {currentInitials}
            </div>
            
            <h3 id="profile-user-name" className="text-lg font-bold text-slate-800 truncate px-2">{currentUser.name}</h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mt-1 inline-block">Registered Member</span>
          </div>

          <div className="w-full space-y-3.5 border-t border-slate-100 pt-5 mt-5">
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <Mail className="w-4.5 h-4.5 text-slate-400" />
              <span className="truncate">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <Calendar className="w-4.5 h-4.5 text-slate-400" />
              <span>Registered 2026 Sandbox</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600">
              <ShieldCheck className="w-4.5 h-4.5 text-slate-400" />
              <span>OAuth Credentials Authenticated</span>
            </div>
          </div>
        </div>

        {/* Database statistics mapping */}
        <div className="md:col-span-8">
          {fitnessDetails ? (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 space-y-6 h-full flex flex-col justify-between">
              
              <div>
                <h4 className="text-slate-800 font-bold text-sm mb-4 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <Activity className="w-4.5 h-4.5 text-indigo-500" />
                  Fitness Records Database File (fitness_details)
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Age</span>
                    <span id="profile-age" className="text-slate-800 font-extrabold text-sm sm:text-base">{fitnessDetails.age} Years</span>
                  </div>
                  <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Gender</span>
                    <span className="text-slate-800 font-extrabold text-sm sm:text-base">{fitnessDetails.gender}</span>
                  </div>
                  <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Height</span>
                    <span className="text-slate-800 font-extrabold text-sm sm:text-base">{fitnessDetails.height} cm</span>
                  </div>
                  <div className="bg-slate-50/80 border border-slate-100 p-3.5 rounded-xl">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Weight</span>
                    <span className="text-slate-800 font-extrabold text-sm sm:text-base">{fitnessDetails.weight} kg</span>
                  </div>
                </div>
              </div>

              {/* Goal & BMI tags */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className={`border p-4 rounded-xl ${getGoalTheme(fitnessDetails.goal)}`}>
                  <span className="text-[10px] font-bold block uppercase tracking-wider mb-1">Assigned Target Fitness Goal</span>
                  <span id="profile-goal-val" className="text-sm font-extrabold">{fitnessDetails.goal}</span>
                </div>
                
                <div className={`border p-4 rounded-xl ${getBmiCategory(fitnessDetails.bmi).color}`}>
                  <span className="text-[10px] font-bold block uppercase tracking-wider mb-1">Body Mass Index (BMI) Assessment</span>
                  <span className="text-sm font-extrabold flex items-center justify-between">
                    <span>{fitnessDetails.bmi}</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-current font-bold">
                      {getBmiCategory(fitnessDetails.bmi).text}
                    </span>
                  </span>
                </div>
              </div>

              {/* Recommendations Mapping Card view */}
              <div className="bg-slate-900 text-white p-4.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-400">Database Recommended Query</span>
                  <p className="text-xs text-slate-300 leading-normal">
                    {fitnessDetails.goal === 'Weight Loss' && 'Diet: Oats, Fruits, Salad  |  Workout: Running, Jump Rope, Cycling'}
                    {fitnessDetails.goal === 'Muscle Gain' && 'Diet: Eggs, Milk, Rice, Chicken  |  Workout: Pushups, Squats, Dumbbell Exercises'}
                    {fitnessDetails.goal === 'Maintain Fitness' && 'Diet: Balanced Diet  |  Workout: Walking, Stretching, Basic Exercises'}
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 text-center flex flex-col justify-center items-center min-h-[340px]">
              <Layers className="w-12 h-12 text-slate-300 mb-3" />
              <h4 className="font-bold text-slate-800 text-base">No Fitness Records Registered yet</h4>
              <p className="text-slate-500 text-sm max-w-sm mt-1 leading-relaxed">
                You haven't filled out your fitness form profile yet. Fill it out in seconds to generate active BMI calculations, custom workouts, and personalized menus!
              </p>
              
              <button
                id="profile-setup-shortcut"
                onClick={onNavigateToForm}
                className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                <span>Complete Fitness Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
