import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true, // <-- Yeh hona zaroori hai
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html', // <-- HTML file ka link
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.users = res;
          this.cdr.detectChanges(); // Turant refresh
        });
      },
      error: (err) => console.error(err),
    });
  }

  changeRole(id: string, newRole: string) {
    if (confirm(`Are you sure you want to change this user to ${newRole}?`)) {
      this.userService.updateRole(id, newRole).subscribe({
        next: () => this.loadUsers(),
        error: (err) => {
          alert(err.error.message || 'Error updating role');
          this.loadUsers();
        },
      });
    } else {
      this.loadUsers();
    }
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user? This will unassign all their tasks.')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.ngZone.run(() => {
            this.users = this.users.filter((u) => u._id !== id);
            this.cdr.detectChanges(); // Turant user ko gayab karega
          });
        },
        error: () => alert('Failed to delete user on server.'),
      });
    }
  }
}