import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-evaluation-column',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluation-column.component.html',
  styleUrl: './evaluation-column.component.css'
})
export class EvaluationColumnComponent {
  @Input() header: string = '';
  @Input() data: any[] = [];
  @Output() headerClick = new EventEmitter<void>();

  isHeaderClicked: boolean = false;

  onHeaderClick(): void {
    this.isHeaderClicked = !this.isHeaderClicked;
    this.headerClick.emit();
  }
}
