import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleResponse } from '../../interfaces/user.interface';

interface RoleData {
  description: string;
  image: string;
}

@Component({
  selector: 'app-role-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role-display.component.html',
  styleUrls: ['./role-display.component.css']
})
export class RoleDisplayComponent {
  @Input() roleCode?: RoleResponse;

  private roleData: Record<string, RoleData> = {
    ADMIN: { description: 'Amministratore', image: 'assets/images/admin.png' },
    DV: { description: 'Developer', image: 'assets/dev.jpg' },
    DESIGNER: { description: 'Designer', image: 'assets/images/designer.png' },
    TL: { description: 'Team Lead', image: 'assets/tl.png' },
    PM: { description: 'Project Manager', image: 'assets/images/pm.png' },
    QA: { description: 'Quality Assurance', image: 'assets/images/qa.png' },
    LM: { description: 'Line Manager', image: 'assets/LM.png' },
  };

  get roleInfo(): RoleData {
    if (!this.roleCode) {
      return { description: 'Ruolo Sconosciuto', image: 'assets/images/default.png' };
    }

    return this.roleData[this.roleCode.code] || {
      description: 'Ruolo Sconosciuto',
      image: 'assets/images/default.png'
    };
  }

  get shouldDisplay(): boolean {
    return !!this.roleCode;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/default-role.png';
  }
}
