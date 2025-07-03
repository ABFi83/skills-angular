import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Project } from '../../interfaces/project.interface';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { RatingIndicatorComponent } from '../rating-indicator/rating-indicator.component';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-project-card-lm',
  standalone: true,
  imports: [CommonModule, RouterModule, UserProfileComponent, RatingIndicatorComponent],
  templateUrl: './project-card-lm.component.html',
  styleUrl: './project-card-lm.component.css'
})
export class ProjectCardLmComponent {
  @Input() project!: Project;

  constructor(
    private router: Router,
    private projectService: ProjectService
  ) {}

  onProjectClick(): void {
    // Update project context - in Angular we'll handle this through the service
    this.projectService.setCurrentProject(this.project);
    this.router.navigate(['/project', this.project.id, 'lm']);
  }
}
