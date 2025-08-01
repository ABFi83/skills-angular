import { Evaluation } from './evaluation.interface';
import { UserResponse, RoleResponse } from './user.interface';

export interface Project {
  id: string;
  projectName: string;
  description: string;
  role?: RoleResponse;
  client?: ClientResponse;
  evaluations: Evaluation[];
  labelEvaluations: Label[];
  users: UserResponse[];
}

export interface Label {
  id: string;
  label: string;
  shortLabel: string;
}

export interface ClientResponse {
  id: number;
  code: string;
  name: string;
  logo: string;
}

export interface Value {
  id: string;
  skill: string;
  value: number;
  improve?: number;
}

export interface ProjectRequest {
  projectName: string;
  description: string;
  clientCode: string;
  clientName: string;
  users: UserResponse[];
  skills: Label[];
}
