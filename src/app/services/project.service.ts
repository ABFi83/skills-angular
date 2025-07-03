import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { Project } from '../interfaces/project.interface';
import { Evaluation, EvaluationsLM } from '../interfaces/evaluation.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private currentProjectSubject = new BehaviorSubject<Project | null>(null);
  public currentProject$ = this.currentProjectSubject.asObservable();

  private projectsSubject = new BehaviorSubject<Project[]>([]);
  public projects$ = this.projectsSubject.asObservable();

  constructor(private apiService: ApiService) {}

  setCurrentProject(project: Project): void {
    this.currentProjectSubject.next(project);

    // Update projects list if the project doesn't exist
    const currentProjects = this.projectsSubject.value;
    const projectExists = currentProjects.some(p => p.id === project.id);

    if (projectExists) {
      const updatedProjects = currentProjects.map(p =>
        p.id === project.id ? project : p
      );
      this.projectsSubject.next(updatedProjects);
    } else {
      this.projectsSubject.next([...currentProjects, project]);
    }
  }

  getCurrentProject(): Project | null {
    return this.currentProjectSubject.value;
  }

  setProjects(projects: Project[]): void {
    this.projectsSubject.next(projects);
  }

  getProjectDetail(projectId: string): Observable<Project> {
    return this.apiService.get<Project>(`/projects/${projectId}`);
  }

  getProjectEvaluations(projectId: string): Observable<EvaluationsLM> {
    return this.apiService.get<EvaluationsLM>(`/projects/${projectId}/evaluations`);
  }

  getUserProjects(): Observable<Project[]> {
    return this.apiService.get<Project[]>('/projects');
  }

  saveValuesEvaluation(evaluation: Evaluation, projectId: string): Observable<Evaluation> {
    return this.apiService.post<Evaluation>(`/projects/${projectId}/evaluations`, evaluation);
  }

  createProject(projectData: any): Observable<Project> {
    return this.apiService.post<Project>('/projects', projectData);
  }

  updateProject(projectId: string, projectData: any): Observable<Project> {
    return this.apiService.put<Project>(`/projects/${projectId}`, projectData);
  }

  deleteProject(projectId: string): Observable<void> {
    return this.apiService.delete<void>(`/projects/${projectId}`);
  }
}
