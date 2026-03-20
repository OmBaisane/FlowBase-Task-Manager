import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    this.loading = true;

    const safeEmail = this.email.trim();
    const safePassword = this.password.trim();

    this.authService.login(safeEmail, safePassword).subscribe({
      next: (res) => {
        const userRole = res.user?.role || this.authService.getUser()?.role;

        if (userRole === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error.message || 'Invalid credentials';
      },
    });
  }
}
