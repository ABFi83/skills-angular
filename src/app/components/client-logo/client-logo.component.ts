import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-client-logo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-logo.component.html',
  styleUrls: ['./client-logo.component.css']
})
export class ClientLogoComponent {
  @Input() clientCode!: string;
  @Input() altText: string = 'Client Logo';
  @Input() className: string = 'client-logo';

  private hasErrorOccurred = false; // Previene loop infinito

  constructor(private clientService: ClientService) {}

  getClientLogoUrl(clientCode: string): string {
    // Chiamata reale al servizio
    return this.clientService.getClientLogoUrl(clientCode);
  }

  onImageError(event: any): void {
    if (!this.hasErrorOccurred) {
      this.hasErrorOccurred = true;
      // Usa un'immagine SVG data URI come fallback sicuro
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHJ4PSI2IiBmaWxsPSIjZTllY2VmIi8+CiAgPHJlY3QgeD0iMjAiIHk9IjIwIiB3aWR0aD0iNDAiIGhlaWdodD0iMjAiIHJ4PSI0IiBmaWxsPSIjNmM3NTdkIi8+CiAgPHRleHQgeD0iNDAiIHk9IjMyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5DTElFTlQ8L3RleHQ+Cjwvc3ZnPg==';
    }
  }
}
