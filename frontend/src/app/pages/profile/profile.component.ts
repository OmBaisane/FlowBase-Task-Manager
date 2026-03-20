import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  isMobileMenuOpen = false;
  user: any = null;
  editMode = false;
  editData = { name: '', email: '' };
  message = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.editData = { name: this.user?.name || '', email: this.user?.email || '' };
  }

  toggleEdit() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.editData = { name: this.user.name, email: this.user.email };
    }
  }

  saveProfile() {
    if (!this.editData.name.trim() || !this.editData.email.trim()) {
      this.message = 'Name and Email are required!';
      setTimeout(() => (this.message = ''), 3000);
      return;
    }

    // Update Local Object
    this.user.name = this.editData.name;
    this.user.email = this.editData.email;

    // Update LocalStorage to keep session active
    localStorage.setItem('user', JSON.stringify(this.user));

    this.message = 'Profile updated successfully!';
    this.editMode = false;

    setTimeout(() => {
      this.message = '';
      window.location.reload();
    }, 1500);
  }
}