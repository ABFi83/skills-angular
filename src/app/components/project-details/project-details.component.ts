import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../interfaces/project.interface';
import { Evaluation } from '../../interfaces/evaluation.interface';
import { HeaderComponent } from '../header/header.component';
import { RatingIndicatorComponent } from '../rating-indicator/rating-indicator.component';
import { RoleDisplayComponent } from '../role-display/role-display.component';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';
import { PolygonLevelComponent } from '../polygon-level/polygon-level.component';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    RatingIndicatorComponent,
    RoleDisplayComponent,
    ConfirmationPopupComponent,
    PolygonLevelComponent
  ],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent implements OnInit {
  project: Project | null = null;
  evaluation: number | null = null;
  loading = true;
  error: string | null = null;

  labelPoligon?: string;
  labelsPoligon?: string[];
  levelsPoligon?: number[];

  isPopupOpen = false;
  missingValues: { [key: string]: boolean } = {};
  isConfirmPopupOpen = false;
  evaluationToSave: Evaluation | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchProject(id);
    } else {
      this.error = 'ID progetto non valido';
      this.loading = false;
    }
  }

  private async fetchProject(id: string): Promise<void> {
    try {
      this.projectService.getProjectDetail(id).subscribe({
        next: (project) => {
          this.compareEvaluations(project.evaluations);
          this.project = project;
          this.labelsPoligon = project.labelEvaluations.map(v => v.shortLabel);

          const firstClosedEvaluation = project.evaluations.find(evaluation => evaluation.close);
          if (firstClosedEvaluation) {
            this.evaluation = firstClosedEvaluation.ratingAverage;
            this.labelPoligon = firstClosedEvaluation.label;
            this.levelsPoligon = firstClosedEvaluation.values.map(v => v.value);
          }
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Errore durante il caricamento del progetto';
          this.loading = false;
          console.error('Error loading project:', err);
        }
      });
    } catch (error) {
      this.error = 'Errore durante il caricamento del progetto';
      this.loading = false;
    }
  }

  private compareEvaluations(evaluations: Evaluation[]): void {
    for (let i = evaluations.length - 1; i > 0; i--) {
      const previousEvaluation = evaluations[i];
      const currentEvaluation = evaluations[i - 1];

      currentEvaluation.values.forEach((currentValue, index) => {
        const previousValue = previousEvaluation.values[index];
        if (currentValue.value < previousValue.value) {
          currentValue.improve = -1;
        } else if (currentValue.value === previousValue.value) {
          currentValue.improve = 0;
        } else {
          currentValue.improve = 1;
        }
      });
    }
  }

  onHeaderClick(evaluation: Evaluation): void {
    if (evaluation.close) {
      this.evaluation = evaluation.ratingAverage;
      this.labelPoligon = evaluation.label;
      this.levelsPoligon = evaluation.values.map(v => v.value);
    }
  }

  onHeaderSaveClick(evaluation: Evaluation): void {
    const missing: { [key: string]: boolean } = {};

    // Initialize missing with all fields set to true
    this.project?.labelEvaluations.forEach((_, index) => {
      missing[index] = true;
    });

    let allValuesPresent = true;

    // Check each value in evaluation.values
    evaluation.values.forEach((value, index) => {
      if (value.value !== undefined && value.value !== null && !isNaN(value.value)) {
        missing[index] = false;
      }
    });

    Object.values(missing).forEach((m) => {
      if (m) {
        allValuesPresent = false;
      }
    });

    this.missingValues = missing;

    if (allValuesPresent) {
      this.evaluationToSave = evaluation;
      this.isConfirmPopupOpen = true;
    }
  }

  async confirmSave(): Promise<void> {
    if (this.evaluationToSave && this.project) {
      try {
        this.projectService.saveValuesEvaluation(this.evaluationToSave, this.project.id).subscribe({
          next: (response) => {
            if (response) {
              // Reload the page/component
              window.location.reload();
            } else {
              console.error('Errore nel salvataggio dei valori');
            }
          },
          error: (error) => {
            console.error('Errore nella chiamata API:', error);
          }
        });
      } catch (error) {
        console.error('Errore:', error);
      }
      this.isConfirmPopupOpen = false;
      this.evaluationToSave = null;
    }
  }

  cancelSave(): void {
    this.isConfirmPopupOpen = false;
    this.evaluationToSave = null;
  }

  goBack(): void {
    this.router.navigate(['/main']);
  }
}
