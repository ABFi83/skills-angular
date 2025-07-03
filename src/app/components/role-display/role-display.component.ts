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
    ADMIN: { description: 'Amministratore', image: 'assets/images/admin.svg' },
    DV: { description: 'Developer', image: 'assets/dev.svg' },
    DESIGNER: { description: 'Designer', image: 'assets/images/designer.svg' },
    TL: { description: 'Team Lead', image: 'assets/tl.svg' },
    PM: { description: 'Project Manager', image: 'assets/images/pm.svg' },
    QA: { description: 'Quality Assurance', image: 'assets/images/qa.svg' },
    LM: { description: 'Line Manager', image: 'assets/LM.svg' },
  };
  get roleInfo(): RoleData {
    if (!this.roleCode) {
      return { description: 'Ruolo Sconosciuto', image: 'assets/images/default.svg' };
    }

    return this.roleData[this.roleCode.code] || {
      description: 'Ruolo Sconosciuto',
      image: 'assets/images/default.svg'
    };
  }

  get shouldDisplay(): boolean {
    return !!this.roleCode;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/default-role.svg';
  }
}
