import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserResponse } from '../../interfaces/user.interface';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, UserProfileComponent, BreadcrumbComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: UserResponse | null = null;
  menuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Recupera lo stato del menu dal localStorage
    const storedMenuState = localStorage.getItem('menuOpen');
    if (storedMenuState) {
      this.menuOpen = JSON.parse(storedMenuState);
    }

    // Subscribe al user corrente
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    localStorage.setItem('menuOpen', JSON.stringify(this.menuOpen));
  }

  handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
