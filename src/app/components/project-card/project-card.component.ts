import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Project } from '../../interfaces/project.interface';
import { RatingIndicatorComponent } from '../rating-indicator/rating-indicator.component';
import { RoleDisplayComponent } from '../role-display/role-display.component';
import { ClientLogoComponent } from '../client-logo/client-logo.component';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, RouterModule, RatingIndicatorComponent, RoleDisplayComponent, ClientLogoComponent],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.css'
})
export class ProjectCardComponent {
  @Input() project!: Project;

  constructor(
    private router: Router,
    private projectService: ProjectService
  ) {}

  onProjectClick(): void {
    this.projectService.setCurrentProject(this.project);
    this.router.navigate(['/project', this.project.id]);
  }
}
