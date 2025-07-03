import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../interfaces/project.interface';
import { UserResponse } from '../../interfaces/user.interface';
import { ProjectCardComponent } from '../project-card/project-card.component';
import { ProjectCardLmComponent } from '../project-card-lm/project-card-lm.component';
import { ProjectCardAddComponent } from '../project-card-add/project-card-add.component';

@Component({
  selector: 'app-project-grid',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ProjectCardComponent,
    ProjectCardLmComponent,
    ProjectCardAddComponent
  ],
  templateUrl: './project-grid.component.html',
  styleUrls: ['./project-grid.component.css']
})
export class ProjectGridComponent implements OnInit {
  projects: Project[] = [];
  user: UserResponse | null = null;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  loadProjects(): void {
    this.projectService.getUserProjects().subscribe({
      next: (projects) => {
        this.projects = projects;

        // If user is admin and "ADD" project doesn't exist, add it
        const addProjectExists = this.projects.some(project => project.id === 'ADD');
        if (this.user?.is_admin && !addProjectExists) {
          const addProject: Project = {
            id: 'ADD',
            projectName: 'Add New Project',
            description: '',
            evaluations: [],
            labelEvaluations: [],
            users: []
          };
          this.projects.push(addProject);
        }
      },
      error: (error) => {
        console.error('Error loading projects:', error);
      }
    });
  }
}
