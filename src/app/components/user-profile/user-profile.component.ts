import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientLogoComponent } from '../client-logo/client-logo.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ClientLogoComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  @Input() username!: string;
  @Input() clientId!: string;
  @Input() viewName: boolean = true;
}
