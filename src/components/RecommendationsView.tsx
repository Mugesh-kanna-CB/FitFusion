/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cpu, Dumbbell, Apple, CheckSquare, Square, Target, Sparkles, BookOpen } from 'lucide-react';
import { FitnessGoal } from '../types';

interface RecommendationsViewProps {
  userGoal: FitnessGoal;
}

export default function RecommendationsView({ userGoal }: RecommendationsViewProps) {
  // Allow sliders or buttons to slide between different goals to see recommendation plans dynamically
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal>(userGoal || 'Maintain Fitness');
  const [viewType, setViewType] = useState<'workout' | 'diet'>('workout');
  
  // Local state for checking items
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getWorkoutPlan = (goal: FitnessGoal) => {
    switch (goal) {
      case 'Weight Loss':
        return {
          title: 'Fat Burn & Aerobic Cardio Blueprint',
          headline: 'Achieve calorie deficit via dynamic steady-state active routines.',
          exercises: [
            { name: 'Running', duration: '30-45 Minutes', desc: 'Maintain steady state or perform active HIIT sprints for maximum lung volume.', primary: true },
            { name: 'Jump Rope', duration: '15-20 Minutes', desc: 'Excellent high intensity cardio to burn massive calories and tone calves.', primary: true },
            { name: 'Cycling', duration: '40 Minutes', desc: 'Low impact cardio perfect for joint health, stamina, and active leg fat burn.', primary: false }
          ]
        };
      case 'Muscle Gain':
        return {
          title: 'Resistance Strength & Hypertrophy Routine',
          headline: 'Trigger progressive muscle growth and cellular hypertrophy.',
          exercises: [
            { name: 'Pushups', duration: '4 Sets x 15-20 Reps', desc: 'Incorporate wide and diamond variations to target chest, shoulders, and triceps.', primary: true },
            { name: 'Squats', duration: '4 Sets x 15 Reps', desc: 'Core compound lower limb lift. Hold weights or bags for increased resistance.', primary: true },
            { name: 'Dumbbell Exercises', duration: '3 Sets x 12 Reps', desc: 'Perform bicep curls, overhead shoulder presses, and dumbbell goblet squats.', primary: true }
          ]
        };
      case 'Maintain Fitness':
      default:
        return {
          title: 'Conditioning & Mobility Longevity Plan',
          headline: 'Maintain joint lubrication, cardiovascular output, and alignment.',
          exercises: [
            { name: 'Walking', duration: '8,000 - 10,000 Daily Steps', desc: 'Incredible active recovery activity for steady mental focus and heart conditioning.', primary: true },
            { name: 'Stretching', duration: '15 Minutes Daily', desc: 'Yoga stretches focusing on hip flexors, hamstrings, and thoracic spine mobility.', primary: true },
            { name: 'Basic Exercises', duration: '20 Minutes', desc: 'Combine light jumping jacks, planks, and glute bridges for core structural tone.', primary: false }
          ]
        };
    }
  };

  const getDietPlan = (goal: FitnessGoal) => {
    switch (goal) {
      case 'Weight Loss':
        return {
          title: 'Caloric Deficit Meal Prep',
          headline: 'Undergo fiber-rich, low glycaemic food combinations for quick fat loss.',
          meals: [
            { meal: 'Breakfast', item: 'Oats & Berries', details: 'High-fiber slow-digesting oats prepared with water or light almond milk, topped with rich organic berries.' },
            { meal: 'Lunch', item: 'Fresh Fruit Basket', details: 'Antioxidant and hydration-rich apples, oranges, and watermelon pairing to stave off snack cravings.' },
            { meal: 'Dinner', item: 'Vibrant Garden Salad', details: 'Deep leafy greens, cucumbers, and tomatoes with a light olive oil drizzle. Add light protein fallback.' }
          ]
        };
      case 'Muscle Gain':
        return {
          title: 'Anabolic High Protein Building Plan',
          headline: 'High protein macro split to trigger accelerated muscle fiber recovery.',
          meals: [
            { meal: 'Breakfast', item: 'Boiled Eggs & Fresh Milk', details: '3-4 whole boiled eggs providing amino-acids, paired with one tall glass of natural full cream cow milk.' },
            { meal: 'Lunch', item: 'Brown Rice with chicken breasts', details: 'Perfect complex carbohydrate carb loaders for fuel, backed by grilled chicken breast for post-workout growth.' },
            { meal: 'Dinner', item: 'High protein recovery bowl', details: 'Seared chicken fillets, soft-boiled eggs, and steamed green vegetables over a light basmati rice bed.' }
          ]
        };
      case 'Maintain Fitness':
      default:
        return {
          title: 'Balanced Macro Sustenance Program',
          headline: 'Equalized nutrient division to sustain current lean mass and high stamina.',
          meals: [
            { meal: 'Meal 1', item: 'Balanced Diet Mix', details: 'A perfect 40/30/35 ratio of clean complex carbs, healthy lean proteins, and unsaturated essential fats.' },
            { meal: 'Meal 2', item: 'Whole wheat greens wrapper', details: 'Whole wheat wraps filled with grilled tofu or light meat, fresh crisp lettuce, and dynamic multi-seed avocados.' },
            { meal: 'Meal 3', item: 'Grains & Greek Yogurt', details: 'High protein unsweetened greek yogurt, mixed flax seeds, and sliced almonds for digestion health.' }
          ]
        };
    }
  };

  const workoutPlan = getWorkoutPlan(selectedGoal);
  const dietPlan = getDietPlan(selectedGoal);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Overview block */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-600" />
              FitFusion Recommendation Engine
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Custom suggestions extracted based on goals. Showing details for <span className="font-semibold text-indigo-600">{selectedGoal}</span>.
            </p>
          </div>
          
          {/* Quick interactive goal simulation slider */}
          <div className="flex items-center gap-1.5 self-start bg-slate-100 p-1 rounded-xl">
            {(['Weight Loss', 'Muscle Gain', 'Maintain Fitness'] as FitnessGoal[]).map((goalOption) => {
              const isActive = selectedGoal === goalOption;
              const isDatabaseGoal = userGoal === goalOption;
              return (
                <button
                  key={goalOption}
                  id={`rec-tab-${goalOption.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setSelectedGoal(goalOption)}
                  className={`
                    px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer relative transition-all duration-200
                    ${isActive 
                      ? 'bg-white text-slate-850 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800'
                    }
                  `}
                >
                  <span>{goalOption.split(' ')[0]}</span>
                  {isDatabaseGoal && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full ring-1 ring-white" title="Your Save Profile Target" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Sync message helper */}
        {userGoal !== selectedGoal && (
          <div className="mt-3 text-[11px] text-amber-600 italic bg-amber-50 rounded-lg py-1.5 px-3 border border-amber-100 w-fit">
            * Currently simulating {selectedGoal} (Your saved profile goal is {userGoal || 'Not Set'})
          </div>
        )}
      </div>

      {/* Selector toggle for workout vs diet */}
      <div className="flex border-b border-slate-200">
        <button
          id="btn-workout-tab"
          onClick={() => setViewType('workout')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-all duration-200 cursor-pointer ${
            viewType === 'workout' 
              ? 'border-indigo-600 text-indigo-600 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Workout Planner</span>
        </button>
        <button
          id="btn-diet-tab"
          onClick={() => setViewType('diet')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 border-b-2 font-semibold text-sm transition-all duration-200 cursor-pointer ${
            viewType === 'diet' 
              ? 'border-indigo-600 text-indigo-600 font-bold' 
              : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          <Apple className="w-4 h-4" />
          <span>Diet & Nutrition</span>
        </button>
      </div>

      {/* Main recommendation Display Tab Panels */}
      {viewType === 'workout' ? (
        <div className="grid md:grid-cols-12 gap-6" id="panel-workout">
          
          {/* Workout list */}
          <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Target className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-lg">{workoutPlan.title}</h3>
              </div>
              <p className="text-slate-500 text-sm">{workoutPlan.headline}</p>
            </div>

            <div className="space-y-4">
              {workoutPlan.exercises.map((ex, index) => {
                const uniqueId = `ex-${selectedGoal}-${index}`;
                const isCompleted = !!checkedItems[uniqueId];
                return (
                  <div 
                    key={index} 
                    id={`workout-card-${ex.name.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => toggleCheck(uniqueId)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isCompleted 
                        ? 'bg-slate-50/75 border-slate-200 opacity-70' 
                        : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    <button id={`chk-${uniqueId}`} className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors">
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold text-sm ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {ex.name}
                        </h4>
                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                          {ex.duration}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{ex.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick tracker stats column */}
          <div className="md:col-span-4 bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-indigo-400 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-455" />
                <span>Today's Log</span>
              </div>
              <h4 className="font-bold text-slate-200 text-base">Progress Checklist</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Click workouts left to mark completions. Consistency maps directly to compound success.
              </p>
            </div>

            <div className="my-6">
              {/* Show simple calculator score */}
              <div className="text-center py-4 bg-slate-800/60 rounded-xl border border-slate-750">
                <div className="text-4xl font-extrabold text-white">
                  {Object.keys(checkedItems).filter(k => k.startsWith(`ex-${selectedGoal}`) && checkedItems[k]).length} / {workoutPlan.exercises.length}
                </div>
                <div className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-1">Exercises Finished</div>
              </div>
            </div>

            <div className="text-[11px] bg-slate-800/30 border border-slate-800 p-3 rounded-lg text-slate-400 italic">
              "Continuous improvement is better than delayed perfection." Try to finish your workout plan today!
            </div>
          </div>

        </div>
      ) : (
        <div id="panel-diet" className="grid md:grid-cols-12 gap-6">
          
          {/* Diet planning items list */}
          <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-800 text-lg">{dietPlan.title}</h3>
              </div>
              <p className="text-slate-500 text-sm">{dietPlan.headline}</p>
            </div>

            <div className="space-y-4">
              {dietPlan.meals.map((mealData, index) => {
                const uniqueId = `meal-${selectedGoal}-${index}`;
                const isCompleted = !!checkedItems[uniqueId];
                return (
                  <div 
                    key={index} 
                    id={`diet-card-${mealData.item.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => toggleCheck(uniqueId)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isCompleted 
                        ? 'bg-slate-50/75 border-slate-200 opacity-70' 
                        : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
                    }`}
                  >
                    <button id={`chk-diet-${uniqueId}`} className="mt-0.5 text-slate-400 hover:text-indigo-500 transition-colors">
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-indigo-600" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold">
                          {mealData.meal}
                        </span>
                        <h4 className={`font-bold text-sm ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {mealData.item}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-505 leading-relaxed">{mealData.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick macro instructions card */}
          <div className="md:col-span-4 bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-indigo-400 mb-2">
                <Apple className="w-4 h-4 text-indigo-400" />
                <span>Hydration & Nutrients</span>
              </div>
              <h4 className="font-bold text-slate-200 text-base">Nourishment Targets</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Check off recipes consumed to calculate daily compliance. Proper diet builds sustainable stamina.
              </p>
            </div>

            <div className="my-6">
              {/* Show progress count */}
              <div className="text-center py-4 bg-slate-800/60 rounded-xl border border-slate-750">
                <div className="text-4xl font-extrabold text-white">
                  {Object.keys(checkedItems).filter(k => k.startsWith(`meal-${selectedGoal}`) && checkedItems[k]).length} / {dietPlan.meals.length}
                </div>
                <div className="text-[11px] text-slate-400 uppercase tracking-widest font-bold mt-1">Meals Tracked</div>
              </div>
            </div>

            <div className="text-[11px] bg-slate-800/30 border border-slate-800 p-3 rounded-lg text-slate-400 leading-normal">
              <span className="font-semibold text-slate-200">Daily Pro Tip:</span><br />
              Make sure to drink 3-4 Liters of purified pure water to balance electrolyte distribution.
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
