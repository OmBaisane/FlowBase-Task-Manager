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

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register() {
    this.loading = true;

    const userData = {
      name: this.name.trim(),
      email: this.email.trim(),
      password: this.password.trim(),
    };

    this.authService.register(userData).subscribe({
      next: (res) => {
        this.loading = false;
        alert('Account created successfully! Please log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error.message || 'Registration failed';
      },
    });
  }
}
