import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TaskFormComponent } from '../../components/task-form/task-form.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { DoughnutChartComponent } from '../../components/chart/doughnut-chart.component';
import { SocketService } from '../../services/socket.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SidebarComponent,
    TaskFormComponent,
    TaskListComponent,
    DoughnutChartComponent,
  ],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  refreshTasks = 0;

  stats = { total: 0, todo: 0, inProgress: 0, completed: 0 };
  chartLabels = ['Todo', 'In Progress', 'Completed'];
  chartColors = ['#94a3b8', '#3b82f6', '#10b981'];

  private subs: Subscription[] = [];

  constructor(
    private socketService: SocketService,
    private taskService: TaskService,
  ) {}

  ngOnInit() {
    this.socketService.connect();
    this.loadStats();

    // Refresh stats on real-time events
    this.subs.push(
      this.socketService.taskCreated$.subscribe(() => this.loadStats()),
      this.socketService.taskUpdated$.subscribe(() => this.loadStats()),
      this.socketService.taskDeleted$.subscribe(() => this.loadStats()),
    );
  }

  ngOnDestroy() {
    this.subs.forEach((s) => s.unsubscribe());
    this.socketService.disconnect();
  }

  loadStats() {
    this.taskService.getStats().subscribe({
      next: (s) => (this.stats = s),
    });
  }

  get chartData(): number[] {
    return [this.stats.todo, this.stats.inProgress, this.stats.completed];
  }

  onTaskCreated() {
    this.refreshTasks++;
    this.loadStats();
  }
}
