import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  user: any = null;
  isDark = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    const saved = localStorage.getItem('theme');
    this.isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.applyTheme();
  }

  toggleDark() {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    this.applyTheme();
  }

  applyTheme() {
    document.documentElement.classList.toggle('dark', this.isDark);
  }

  logout() {
    this.authService.logout();
  }

  get initials(): string {
    if (!this.user?.name) return '?';
    return this.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
