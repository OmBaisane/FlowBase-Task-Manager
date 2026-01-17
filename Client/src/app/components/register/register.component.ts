import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html', // 👈 FIXED
  styles: []
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  @Output() switchToLogin = new EventEmitter<void>();

  onRegister() {
    if (this.name && this.email && this.password) {
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match! ❌");
        return;
      }
      alert('Registration Successful! Please Login. ✅');
      this.switchToLogin.emit();
    } else {
      alert('Please fill all details!');
    }
  }
}