/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calculator, Scale, Ruler, Sparkles, AlertCircle, Info } from 'lucide-react';

interface BmiCalculatorProps {
  userHeight?: number;
  userWeight?: number;
}

export default function BmiCalculatorView({ userHeight = 175, userWeight = 70 }: BmiCalculatorProps) {
  // Use state default to user's database values if they exist, else standard defaults
  const [height, setHeight] = useState<number>(userHeight || 170);
  const [weight, setWeight] = useState<number>(userWeight || 65);
  const [bmi, setBmi] = useState<number>(22.5);

  useEffect(() => {
    if (userHeight > 0) setHeight(userHeight);
    if (userWeight > 0) setWeight(userWeight);
  }, [userHeight, userWeight]);

  useEffect(() => {
    const heightInM = height / 100;
    if (heightInM > 0) {
      const calculated = weight / (heightInM * heightInM);
      setBmi(parseFloat(calculated.toFixed(1)));
    }
  }, [height, weight]);

  // Compute standard ideal ranges
  const minNormalWeight = parseFloat((18.5 * (height / 100) * (height / 100)).toFixed(1));
  const maxNormalWeight = parseFloat((24.9 * (height / 100) * (height / 100)).toFixed(1));

  const getBmiDetails = (val: number) => {
    if (val < 18.5) {
      return {
        label: 'Underweight',
        color: 'bg-sky-500',
        textColor: 'text-sky-600',
        bgColor: 'bg-sky-50',
        borderColor: 'border-sky-200',
        advice: 'Focus on nutrient-rich foods, healthy fats, and strength training to build functional muscle mass.'
      };
    }
    if (val < 25) {
      return {
        label: 'Normal / Healthy Weight',
        color: 'bg-emerald-500',
        textColor: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        advice: 'Outstanding! Maintain your balanced nutritional patterns and regular cardiovascular and aerobic activities.'
      };
    }
    if (val < 30) {
      return {
        label: 'Overweight',
        color: 'bg-amber-500',
        textColor: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        advice: 'Incorporate portion tracking, caloric deficit controls, and steady-state cardiovascular exercises.'
      };
    }
    return {
      label: 'Obese Range',
      color: 'bg-rose-500',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      advice: 'Prioritize physical activities, fiber-rich diets, and consult wellness professionals for tailored weight loss programs.'
    };
  };

  const status = getBmiDetails(bmi);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-indigo-500" />
          Interactive BMI Calculator
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Calculate your Body Mass Index (BMI) instantly. Drag the sliders to check hypothetical ranges, or see what your ideal weight should be for your height.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        
        {/* Sliders and custom triggers Column */}
        <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500">
            Real-time Adjustment Sliders
          </h3>

          {/* Height slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-slate-400" />
                Height
              </span>
              <span className="text-sm font-bold text-slate-900">{height} cm</span>
            </div>
            <input
              id="slider-height"
              type="range"
              min="100"
              max="220"
              step="1"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>100 cm</span>
              <span>160 cm</span>
              <span>220 cm</span>
            </div>
          </div>

          {/* Weight slider */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-slate-400" />
                Weight
              </span>
              <span className="text-sm font-bold text-slate-900">{weight} kg</span>
            </div>
            <input
              id="slider-weight"
              type="range"
              min="30"
              max="150"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>30 kg</span>
              <span>90 kg</span>
              <span>150 kg</span>
            </div>
          </div>

          {/* Ideal metrics summary banner */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Healthy Target Assessment
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-450 block mb-1">
                  Ideal Weight Range
                </span>
                <span className="text-slate-800 font-extrabold text-sm sm:text-base">
                  {minNormalWeight} - {maxNormalWeight} kg
                </span>
              </div>
              <div className="bg-indigo-50/40 p-4 rounded-xl border border-indigo-50">
                <span className="text-[10px] uppercase font-bold text-indigo-500 block mb-1">
                  Status Advice
                </span>
                <span className="text-slate-800 font-bold text-xs leading-normal">
                  Ideal for {height} cm
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Target Gauges Graph */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-6">
          {/* Main calculated result card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between border border-slate-800 shadow-md h-full min-h-[240px]">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 block mb-1">
                Your Calculated Index
              </span>
              <h3 className="text-slate-400 text-xs">Body Mass Index (BMI)</h3>
            </div>

            <div className="text-center py-4">
              <div id="output-bmi-value" className="text-6xl font-extrabold tracking-tight text-white mb-2">
                {bmi}
              </div>
              <div id="output-bmi-label" className={`text-sm font-semibold tracking-wide flex items-center justify-center gap-1.5`}>
                <span className={`w-2.5 h-2.5 rounded-full ${status.color}`} />
                <span className="text-slate-200">{status.label}</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-750 text-[11px] text-slate-350 leading-relaxed">
              <span className="font-bold text-slate-200">Suggested Action: </span><br />
              {status.advice}
            </div>
          </div>
          
        </div>

      </div>

      {/* Detailed spectrum reference map */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-semibold text-slate-800 text-sm mb-4 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-500" />
          Standard Reference Scale Reference Mapping
        </h3>
        
        <div className="grid grid-cols-4 gap-2 text-center text-xs font-medium">
          <div className="bg-sky-50 text-sky-700 p-3 rounded-lg border border-sky-100">
            <span className="font-bold block text-sm">Under 18.5</span>
            <span className="text-[10px] text-sky-500">Underweight</span>
          </div>
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg border border-emerald-100">
            <span className="font-bold block text-sm">18.5 – 24.9</span>
            <span className="text-[10px] text-emerald-500">Normal Range</span>
          </div>
          <div className="bg-amber-50 text-amber-700 p-3 rounded-lg border border-amber-100">
            <span className="font-bold block text-sm">25.0 – 29.9</span>
            <span className="text-[10px] text-amber-500">Overweight</span>
          </div>
          <div className="bg-rose-50 text-rose-700 p-3 rounded-lg border border-rose-100">
            <span className="font-bold block text-sm">Over 30.0</span>
            <span className="text-[10px] text-rose-500">Obese Range</span>
          </div>
        </div>
      </div>
    </div>
  );
}
