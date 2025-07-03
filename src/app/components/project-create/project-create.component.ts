import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../services/project.service';
import { HeaderComponent } from '../header/header.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { SearchDropdownComponent } from '../search-dropdown/search-dropdown.component';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, BreadcrumbComponent, SearchDropdownComponent],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.css'
})
export class ProjectCreateComponent {
  projectForm = {
    projectName: '',
    description: '',
    clientCode: '',
    clientName: '',
    users: [],
    skills: []
  };

  isLoading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private projectService: ProjectService
  ) {}

  onSubmit(): void {
    if (this.validateForm()) {
      this.isLoading = true;
      this.error = null;

      this.projectService.createProject(this.projectForm).subscribe({
        next: (project) => {
          this.router.navigate(['/project', project.id]);
        },
        error: (err) => {
          this.error = 'Errore durante la creazione del progetto';
          this.isLoading = false;
          console.error('Error creating project:', err);
        }
      });
    }
  }

  private validateForm(): boolean {
    if (!this.projectForm.projectName.trim()) {
      this.error = 'Il nome del progetto è obbligatorio';
      return false;
    }
    return true;
  }

  onCancel(): void {
    this.router.navigate(['/main']);
  }

  // Placeholder for client search
  fetchClients = async (query: string): Promise<any[]> => {
    // TODO: Implement client search
    return [];
  };

  onClientSelect(client: any): void {
    this.projectForm.clientCode = client.code;
    this.projectForm.clientName = client.name;
  }
}
