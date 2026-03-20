import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  // Mobile menu control
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  // Tab switch control 
  @Output() changeTab = new EventEmitter<string>();

  user: any = null;
  isAdmin = false;
  activeTab = 'dashboard'; // Default tab

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
    this.isAdmin = this.authService.isAdmin();
  }

  selectTab(tabName: string) {
    this.activeTab = tabName;
    this.changeTab.emit(tabName);
    this.closeSidebar.emit();
  }

  logout() {
    this.authService.logout();
  }

  onLinkClick() {
    this.closeSidebar.emit();
  }
}