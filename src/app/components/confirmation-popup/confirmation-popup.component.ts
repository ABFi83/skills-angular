import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-popup.component.html',
  styleUrl: './confirmation-popup.component.css'
})
export class ConfirmationPopupComponent {
  @Input() isOpen: boolean = false;
  @Input() message: string = '';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
