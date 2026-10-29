/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  created_at?: string;
}

export type FitnessGoal = 'Weight Loss' | 'Muscle Gain' | 'Maintain Fitness';
export type Gender = 'Male' | 'Female' | 'Other';

export interface FitnessDetails {
  id?: string;
  user_id: string;
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  goal: FitnessGoal;
  bmi: number;
  updated_at?: string;
}

export interface WorkoutRecommendation {
  title: string;
  description: string;
  exercises: string[];
}

export interface DietRecommendation {
  title: string;
  description: string;
  items: string[];
}
