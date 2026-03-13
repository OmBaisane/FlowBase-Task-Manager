import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  user: any = null;
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.isAdmin = this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
  }
}
