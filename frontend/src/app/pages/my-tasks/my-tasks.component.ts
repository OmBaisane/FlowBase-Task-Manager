import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, TaskListComponent],
  templateUrl: './my-tasks.component.html',
})
export class MyTasksComponent {
  isMobileMenuOpen = false;

  refreshTasks: number = 0;
}