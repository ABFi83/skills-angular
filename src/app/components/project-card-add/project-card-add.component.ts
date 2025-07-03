import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-project-card-add',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './project-card-add.component.html',
  styleUrl: './project-card-add.component.css'
})
export class ProjectCardAddComponent {

  constructor(private router: Router) {}

  onCreateProject(): void {
    this.router.navigate(['/project/new']);
  }
}
