import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent {
  email = '';
  password = '';

  @Output() loginSuccess = new EventEmitter<boolean>();
  @Output() switchToRegister = new EventEmitter<void>(); // 👈 New Signal

  onLogin() {
    // FAKE LOGIN
    if (this.email === 'admin@flowbase.com' && this.password === '123456') {
      this.loginSuccess.emit(true);
    } else {
      alert('Invalid Credentials! Try: admin@flowbase.com / 123456');
    }
  }
}