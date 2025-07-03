import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-indicator.component.html',
  styleUrl: './rating-indicator.component.css'
})
export class RatingIndicatorComponent {
  @Input() value: number | null = null;

  get displayValue(): string {
    return this.value ? this.value.toFixed(1) : '1.0';
  }

  get isPositive(): boolean {
    return (this.value || 0) > 6;
  }
}
