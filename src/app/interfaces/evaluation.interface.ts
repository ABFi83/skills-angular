import { Label, Value } from './project.interface';
import { UserResponse } from './user.interface';

export interface Evaluation {
  id: string;
  label: string; //01/01/2024
  values: Value[];
  startDate: Date;
  endDate: Date;
  close: boolean;
  ratingAverage: number;
}

export interface EvaluationRequest {
  label: string;
  startDate: Date;
  endDate: Date;
  values?: Value[];
  close?: boolean;
  ratingAverage?: number;
}

export interface ValueRequest {
  evaluationId?: number;
  values: Value[];
}

export interface EvaluationLM {
  skillId: string; // ID of the skill
  userId: string; // ID of the user
  score: number; // Score for the skill
  user: UserResponse; // User details
}

export interface EvaluationsLM {
  evaluation: EvaluationLM[];
  skill: Label[];
}
