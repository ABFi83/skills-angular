import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProjectService } from '../../services/project.service';
import { UserService } from '../../services/user.service';
import { SkillService } from '../../services/skill.service';
import { ClientService } from '../../services/client.service';
import { EvaluationService } from '../../services/evaluation.service';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../interfaces/project.interface';
import { UserResponse } from '../../interfaces/user.interface';
import { EvaluationLM, EvaluationsLM, EvaluationRequest } from '../../interfaces/evaluation.interface';
import { HeaderComponent } from '../header/header.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { RoleDisplayComponent } from '../role-display/role-display.component';
import { SearchDropdownComponent } from '../search-dropdown/search-dropdown.component';
import { ClientLogoComponent } from '../client-logo/client-logo.component';
import { EvaluationPopupComponent, EvaluationData } from '../evaluation-popup/evaluation-popup.component';

interface ProjectRequest {
  projectName: string;
  description: string;
  clientCode: string;
  clientName: string;
  users: any[];
  skills: any[];
}

@Component({
  selector: 'app-project-details-lm',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    UserProfileComponent,
    RoleDisplayComponent,
    SearchDropdownComponent,
    ClientLogoComponent,
    EvaluationPopupComponent
  ],
  templateUrl: './project-details-lm.component.html',
  styleUrl: './project-details-lm.component.css'
})
export class ProjectDetailsLmComponent implements OnInit {
  project: Project | null = null;
  isEditing = false;
  editedProject: ProjectRequest = {
    projectName: '',
    description: '',
    clientCode: '',
    clientName: '',
    users: [],
    skills: []
  };

  activeTab = 'tab1';
  isSkillSearchVisible = false;
  isUserSearchVisible = false;
  selectedUser: UserResponse | null = null;
  selectedRole: any = null;
  clientLogoCode: string | null = null;
  selectedEvaluationDate: string | null = null;
  evaluationsLM: EvaluationLM[] = [];
  evaluationDates: string[] = [];
  skillError: string | null = null;
  userError: string | null = null;
  loading = true;
  error: string | null = null;
  showEvaluationPopup = false;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private userService: UserService,
    private skillService: SkillService,
    private clientService: ClientService,
    private evaluationService: EvaluationService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated
    const token = this.authService.currentToken;
    console.log('ProjectDetailsLM - Token check:', token ? 'Token present' : 'No token');

    if (!token) {
      this.error = 'Authentication required';
      this.loading = false;
      this.toastr.error('Please login to access this page', 'Authentication Required');
      this.router.navigate(['/login']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchProject(id);
    } else {
      this.error = 'ID progetto non valido';
      this.loading = false;
    }
  }

  private fetchProject(id: string): void {
    this.projectService.getProjectDetail(id).subscribe({
      next: (project) => {
        this.project = project;
        this.editedProject = {
          projectName: project.projectName,
          description: project.description || '',
          clientCode: project.client?.code || '',
          clientName: project.client?.name || '',
          users: project.users || [],
          skills: project.labelEvaluations || []
        };
        this.clientLogoCode = project.client?.code || null;
        this.loading = false;

        // First load evaluation dates, then load evaluations
        this.setupEvaluationDates();
      },
      error: (err) => {
        this.error = 'Errore durante il caricamento del progetto';
        this.loading = false;
        console.error('Error loading project:', err);
      }
    });
  }

  private fetchProjectEvaluations(projectId: string): void {
    if (!this.selectedEvaluationDate) {
      console.error('No evaluation date selected');
      return;
    }

    this.evaluationService.getProjectEvaluations(projectId, this.selectedEvaluationDate).subscribe({
      next: (evaluationsData: EvaluationsLM) => {
        this.evaluationsLM = evaluationsData.evaluation || [];
      },
      error: (err) => {
        console.error('Error loading project evaluations:', err);
        // Create mock data for demonstration
        this.createMockEvaluations();
      }
    });
  }

  private setupEvaluationDates(): void {
    if (this.project) {
      this.evaluationService.getEvaluationDates(this.project.id).subscribe({
        next: (dates) => {
          this.evaluationDates = dates || [];
          if (this.evaluationDates.length > 0) {
            this.selectedEvaluationDate = this.evaluationDates[0];
            // Now that we have the first date, load the evaluations
            this.fetchProjectEvaluations(this.project!.id);
          }
        },
        error: (err) => {
          console.error('Error loading evaluation dates:', err);
          // Fallback to mock dates if API fails
          this.evaluationDates = ['2024-01-15', '2024-02-15', '2024-03-15', '2024-04-15'];
          if (this.evaluationDates.length > 0) {
            this.selectedEvaluationDate = this.evaluationDates[0];
            // Load evaluations with the first mock date
            this.fetchProjectEvaluations(this.project!.id);
          }
        }
      });
    }
  }

  private createMockEvaluations(): void {
    if (!this.project || !this.project.users || !this.editedProject.skills) {
      return;
    }

    // Create mock evaluations for demonstration
    this.evaluationsLM = [];

    this.project.users.forEach(user => {
      this.editedProject.skills.forEach(skill => {
        // Create random evaluations for each user-skill combination
        const randomScore = Math.floor(Math.random() * 10) + 1; // 1-10
        this.evaluationsLM.push({
          skillId: skill.id,
          userId: user.id,
          score: randomScore,
          user: user
        });
      });
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onEvaluationDateChange(): void {
    if (this.project && this.selectedEvaluationDate) {
      this.fetchProjectEvaluations(this.project.id);
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveProject(): void {
    if (this.project && !this.saving) {
      this.saving = true;
      console.log('Saving project:', this.editedProject);

      const updateData = {
        projectName: this.editedProject.projectName,
        description: this.editedProject.description,
        clientCode: this.editedProject.clientCode,
        users: this.editedProject.users,
        skills: this.editedProject.skills
      };

      this.projectService.updateProject(this.project.id, updateData).subscribe({
        next: (updatedProject) => {
          console.log('Project updated successfully:', updatedProject);
          this.project = updatedProject;
          this.isEditing = false;
          this.saving = false;
          this.toastr.success('Project updated successfully!', 'Success');
        },
        error: (err) => {
          console.error('Error updating project:', err);
          this.saving = false;
          this.toastr.error('Failed to update project', 'Error');
        }
      });
    }
  }

  cancelEdit(): void {
    if (this.project) {
      this.editedProject = {
        projectName: this.project.projectName,
        description: this.project.description || '',
        clientCode: this.project.client?.code || '',
        clientName: this.project.client?.name || '',
        users: this.project.users || [],
        skills: this.project.labelEvaluations || []
      };
    }
    this.isEditing = false;
  }

  deleteProject(): void {
    if (this.project && confirm('Sei sicuro di voler eliminare questo progetto?')) {
      this.projectService.deleteProject(this.project.id).subscribe({
        next: () => {
          this.toastr.success('Project deleted successfully!', 'Success');
          this.router.navigate(['/main']);
        },
        error: (err) => {
          console.error('Error deleting project:', err);
          this.toastr.error('Failed to delete project', 'Error');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/main']);
  }

  // Search functionality methods
  fetchUsers = async (query: string): Promise<UserResponse[]> => {
    try {
      const users = await this.userService.getUsers(query).toPromise();
      console.log('Utenti trovati:', users);
      return users || [];
    } catch (error) {
      console.error('Errore durante il recupero degli utenti:', error);
      return [];
    }
  };

  fetchSkills = async (query: string): Promise<any[]> => {
    try {
      console.log('fetchSkills - About to call skillService.getSkills with query:', query);
      console.log('fetchSkills - Current token:', this.authService.currentToken ? 'Present' : 'Missing');

      const skills = await this.skillService.getSkills(query).toPromise();
      console.log('Skills trovate:', skills);
      return skills || [];
    } catch (error) {
      console.error('Errore durante il recupero delle skills:', error);
      this.toastr.error('Failed to fetch skills. Check authentication.', 'Error');
      return [];
    }
  };

  fetchClients = async (query: string): Promise<any[]> => {
    try {
      const clients = await this.clientService.getClients(query).toPromise();
      console.log('Clienti trovati:', clients);
      return clients || [];
    } catch (error) {
      console.error('Errore durante il recupero dei clienti:', error);
      return [];
    }
  };

  onUserSelect(user: UserResponse): void {
    // Check if user already exists
    const exists = this.editedProject.users.some(u => u.id === user.id);
    if (exists) {
      this.userError = 'Questo utente è già presente nel progetto';
      this.toastr.warning('User already exists in project', 'Warning');
      return;
    }

    // Add user to project
    this.editedProject.users.push(user);
    this.selectedUser = user;
    this.isUserSearchVisible = false;
    this.userError = null;
    this.toastr.success('User added to project', 'Success');
  }

  onSkillSelect(skill: any): void {
    // Check if skill already exists
    const exists = this.editedProject.skills.some(s => s.id === skill.id);
    if (exists) {
      this.skillError = 'Questa skill è già stata aggiunta al progetto';
      this.toastr.warning('Skill already exists in project', 'Warning');
      return;
    }

    // Add skill to project
    const newSkill = {
      id: skill.id,
      label: skill.name,
      shortLabel: skill.shortLabel || skill.name
    };
    this.editedProject.skills.push(newSkill);
    this.isSkillSearchVisible = false;
    this.skillError = null;
    this.toastr.success('Skill added to project', 'Success');
  }

  onClientSelect(client: any): void {
    this.editedProject.clientCode = client.code;
    this.editedProject.clientName = client.name;
    this.clientLogoCode = client.code;
  }

  // Additional methods for the new template
  createEvaluation(): void {
    this.showEvaluationPopup = true;
  }

  onEvaluationCreate(evaluationData: EvaluationData): void {
    console.log('Creating evaluation:', evaluationData);

    if (this.project) {
      const evaluation: EvaluationRequest = {
        label: evaluationData.label,
        startDate: new Date(evaluationData.startDate),
        endDate: new Date(evaluationData.endDate),
        values: [],
        close: false,
        ratingAverage: 0
      };

      this.evaluationService.createEvaluation(this.project.id, evaluation).subscribe({
        next: (newEvaluation) => {
          console.log('Evaluation created:', newEvaluation);
          this.toastr.success('Evaluation created successfully!', 'Success');
          this.fetchProjectEvaluations(this.project!.id);
        },
        error: (err) => {
          console.error('Error creating evaluation:', err);
          this.toastr.error('Failed to create evaluation', 'Error');
        }
      });
    }

    this.showEvaluationPopup = false;
  }

  onEvaluationPopupClose(): void {
    this.showEvaluationPopup = false;
  }

  getEvaluationsForCell(skillId: string, score: number): EvaluationLM[] {
    if (!this.evaluationsLM) return [];
    return this.evaluationsLM.filter(
      (evaluation) => evaluation.skillId == skillId && evaluation.score == score
    );
  }

  toggleSkillSearch(): void {
    this.skillError = null;
    this.isSkillSearchVisible = !this.isSkillSearchVisible;
  }

  toggleUserSearch(): void {
    this.userError = null;
    this.isUserSearchVisible = !this.isUserSearchVisible;
  }

  removeSkill(index: number): void {
    if (confirm('Are you sure you want to remove this skill?')) {
      this.editedProject.skills.splice(index, 1);
      this.toastr.info('Skill removed', 'Info');
    }
  }

  removeUser(index: number): void {
    if (confirm('Are you sure you want to remove this user?')) {
      this.editedProject.users.splice(index, 1);
      this.toastr.info('User removed', 'Info');
    }
  }

  // Debug helper method - remove in production
  setTestToken(token: string): void {
    localStorage.setItem('token', token);
    console.log('Test token set in localStorage');
  }
}
