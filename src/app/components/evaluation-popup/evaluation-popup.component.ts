import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface EvaluationData {
  label: string;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-evaluation-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './evaluation-popup.component.html',
  styleUrls: ['./evaluation-popup.component.css']
})
export class EvaluationPopupComponent {
  @Input() isVisible = false;
  @Output() evaluationCreate = new EventEmitter<EvaluationData>();
  @Output() popupClose = new EventEmitter<void>();

  evaluationData: EvaluationData = {
    label: '',
    startDate: '',
    endDate: ''
  };

  constructor() {}

  onSubmit(): void {
    if (this.isFormValid()) {
      this.evaluationCreate.emit({ ...this.evaluationData });
      this.resetForm();
    }
  }

  onCancel(): void {
    this.resetForm();
    this.popupClose.emit();
  }

  onClose(): void {
    this.resetForm();
    this.popupClose.emit();
  }

  isFormValid(): boolean {
    return !!(
      this.evaluationData.label &&
      this.evaluationData.startDate &&
      this.evaluationData.endDate &&
      new Date(this.evaluationData.startDate) <= new Date(this.evaluationData.endDate)
    );
  }

  private resetForm(): void {
    this.evaluationData = {
      label: '',
      startDate: '',
      endDate: ''
    };
  }

  get isStartDateValid(): boolean {
    return !!this.evaluationData.startDate;
  }

  get isEndDateValid(): boolean {
    return !!(
      this.evaluationData.endDate &&
      this.evaluationData.startDate &&
      new Date(this.evaluationData.startDate) <= new Date(this.evaluationData.endDate)
    );
  }

  get isLabelValid(): boolean {
    return !!(this.evaluationData.label && this.evaluationData.label.trim().length > 0);
  }
}
