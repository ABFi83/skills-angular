import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onSubmit(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.error = null;
        this.router.navigate(['/main']);
        this.toastr.success('Login effettuato con successo!');
      },
      error: (error) => {
        this.error = 'Errore nel login: username o password non corretti.';
        this.toastr.error('Errore nel login');
        console.error('Errore nel login', error);
      }
    });
  }
}
