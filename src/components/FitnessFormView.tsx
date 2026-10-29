/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserSquare2, Scale, Ruler, Activity, Check, Loader2, ArrowRight } from 'lucide-react';
import { FitnessDetails, FitnessGoal, Gender } from '../types';
import { fitnessService } from '../supabaseClient';

interface FitnessFormViewProps {
  userId: string;
  existingDetails: FitnessDetails | null;
  onSaveSuccess: (updated: FitnessDetails) => void;
}

export default function FitnessFormView({ userId, existingDetails, onSaveSuccess }: FitnessFormViewProps) {
  // State variables for inputs
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<Gender>('Male');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [goal, setGoal] = useState<FitnessGoal>('Maintain Fitness');

  const [bmi, setBmi] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Populate data if existing details exist
  useEffect(() => {
    if (existingDetails) {
      setAge(existingDetails.age.toString());
      setGender(existingDetails.gender);
      setHeight(existingDetails.height.toString());
      setWeight(existingDetails.weight.toString());
      setGoal(existingDetails.goal);
      setBmi(existingDetails.bmi);
    }
  }, [existingDetails]);

  // Recalculate BMI in real-time as height and weight changes
  useEffect(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const heightInMeters = h / 100;
      const computedBmi = w / (heightInMeters * heightInMeters);
      setBmi(parseFloat(computedBmi.toFixed(1)));
    } else {
      setBmi(0);
    }
  }, [height, weight]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(false);

    const parsedAge = parseInt(age);
    const parsedHeight = parseFloat(height);
    const parsedWeight = parseFloat(weight);

    if (!parsedAge || parsedAge <= 0 || parsedAge > 120) {
      setErrorMsg('Please enter a valid age (1-120).');
      return;
    }
    if (!parsedHeight || parsedHeight < 50 || parsedHeight > 300) {
      setErrorMsg('Please enter a valid height in cm (50-300).');
      return;
    }
    if (!parsedWeight || parsedWeight < 10 || parsedWeight > 500) {
      setErrorMsg('Please enter a valid weight in kg (10-500).');
      return;
    }

    setLoading(true);

    const newFitnessDetails: FitnessDetails = {
      user_id: userId,
      age: parsedAge,
      gender,
      height: parsedHeight,
      weight: parsedWeight,
      goal,
      bmi: bmi
    };

    try {
      const { details, error } = await fitnessService.saveDetails(newFitnessDetails);
      if (error) {
        setErrorMsg(error);
      } else if (details) {
        setSuccessMsg(true);
        onSaveSuccess(details);
        setTimeout(() => setSuccessMsg(false), 4000);
      }
    } catch {
      setErrorMsg('Failed to store statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBmiCategory = (bmiVal: number) => {
    if (bmiVal === 0) return { label: 'Enter details', color: 'text-slate-400' };
    if (bmiVal < 18.5) return { label: 'Underweight', color: 'text-sky-500' };
    if (bmiVal < 25) return { label: 'Normal / Healthy', color: 'text-emerald-500' };
    if (bmiVal < 30) return { label: 'Overweight', color: 'text-amber-500' };
    return { label: 'Obese', color: 'text-rose-500' };
  };

  const currentCategory = getBmiCategory(bmi);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title block */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <UserSquare2 className="w-5 h-5 text-indigo-550" />
          Fitness Form Profile
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Complete your physical information below to automatically calculate your body mass index and update recommended targets inside the dashboard.
        </p>
      </div>

      {successMsg && (
        <div id="form-success-banner" className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold flex items-center gap-2">
          <Check className="w-4.5 h-4.5 text-indigo-600" />
          <span>Fitness metrics successfully saved! Dashboard and Recommendations updated.</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-medium">
          {errorMsg}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Form panel */}
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Age input */}
            <div>
              <label htmlFor="input-age" className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">
                Age
              </label>
              <input
                id="input-age"
                type="number"
                required
                min="1"
                max="120"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 22"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white text-sm transition-all"
              />
            </div>

            {/* Gender Selection */}
            <div>
              <label htmlFor="select-gender" className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2">
                Gender
              </label>
              <select
                id="select-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white text-sm transition-all cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Height Input */}
            <div>
              <label htmlFor="input-height" className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
                <Ruler className="w-4 h-4 text-slate-400" />
                Height (cm)
              </label>
              <input
                id="input-height"
                type="number"
                required
                min="50"
                max="300"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 175"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white text-sm transition-all"
              />
            </div>

            {/* Weight Input */}
            <div>
              <label htmlFor="input-weight" className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1">
                <Scale className="w-4 h-4 text-slate-400" />
                Weight (kg)
              </label>
              <input
                id="input-weight"
                type="number"
                required
                min="10"
                max="500"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 70"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 outline-none focus:border-indigo-500 focus:bg-white text-sm transition-all"
              />
            </div>
          </div>

          {/* Fitness Goal Grid cards */}
          <div>
            <label className="block text-slate-700 text-xs font-semibold uppercase tracking-wider mb-3">
              Fitness Goal
            </label>
            <div className="grid sm:grid-cols-3 gap-3">
              {(['Weight Loss', 'Muscle Gain', 'Maintain Fitness'] as FitnessGoal[]).map((goalOption) => {
                const isSelected = goal === goalOption;
                return (
                  <button
                    key={goalOption}
                    id={`goal-choice-${goalOption.replace(/\s+/g, '-').toLowerCase()}`}
                    type="button"
                    onClick={() => setGoal(goalOption)}
                    className={`
                      text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-24
                      ${isSelected 
                        ? 'border-indigo-500 bg-indigo-50/40' 
                        : 'border-slate-200 bg-white hover:border-slate-350 hover:bg-slate-50/50'
                      }
                    `}
                  >
                    <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {goalOption}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-normal">
                      {goalOption === 'Weight Loss' && 'Burn calories through active cardios'}
                      {goalOption === 'Muscle Gain' && 'Build muscle using resistance lifts'}
                      {goalOption === 'Maintain Fitness' && 'Stay tone, fit and active regularly'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-150">
            <button
              id="submit-fitness-btn"
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save Profile Blueprint</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Realtime Live BMI Indicator Pane */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between shadow-md relative overflow-hidden border border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">
              <Activity className="w-4.5 h-4.5 text-indigo-400" />
              <span>Real-Time Indexer</span>
            </div>
            
            <h3 className="font-bold text-slate-200 text-base">BMI Calculation</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Based on height and weight inputs. Standard Formula: Weight / Height²
            </p>
          </div>

          <div className="my-8 text-center">
            <div id="live-bmi-val" className="text-5xl font-extrabold tracking-tight text-white mb-2">
              {bmi > 0 ? bmi : '0.0'}
            </div>
            <div id="live-bmi-label" className={`text-sm font-semibold tracking-wide ${currentCategory.color}`}>
              {currentCategory.label}
            </div>
          </div>

          {bmi > 0 ? (
            <div className="bg-slate-800/80 p-3 rounded-xl text-[11px] text-slate-350 leading-relaxed border border-slate-750">
              <span className="font-bold text-slate-200">Recommendation Goal:</span><br />
              {goal === 'Weight Loss' && 'Caloric deficit diet paired with running & rope skips.'}
              {goal === 'Muscle Gain' && 'High protein nourishment plan paired with daily pushups & dumbbell lifts.'}
              {goal === 'Maintain Fitness' && 'Balanced meal plan and regular walking or basic stretches.'}
            </div>
          ) : (
            <div className="text-slate-500 text-xs text-center italic py-2">
              Enter physical numbers left to compute targets
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
