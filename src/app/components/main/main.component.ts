import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ProjectGridComponent } from '../project-grid/project-grid.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ProjectGridComponent, HeaderComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
}
