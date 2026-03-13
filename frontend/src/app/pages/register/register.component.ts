import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role = 'user';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    this.error = '';
    this.loading = true;
    this.authService.register({ name: this.name, email: this.email, password: this.password, role: this.role }).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.user?.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed.';
      },
    });
  }
}
