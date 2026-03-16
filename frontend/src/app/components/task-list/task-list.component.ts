import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef, // <-- ADDED
  NgZone, // <-- ADDED
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './task-list.component.html',
})
export class TaskListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() refresh = 0;

  tasks: any[] = [];
  filteredTasks: any[] = [];
  user: any = null;
  isAdmin = false;
  filterStatus = '';
  filterPriority = '';
  searchQuery = '';
  loading = true;

  stats = { total: 0, todo: 0, inProgress: 0, completed: 0 };

  private subs: Subscription[] = [];

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef, // <-- INJECTED
    private ngZone: NgZone, // <-- INJECTED
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.isAdmin = this.authService.isAdmin();

    this.loadTasks();
    this.setupSocketListeners();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['refresh'] && !changes['refresh'].firstChange) {
      this.loadTasks();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
  }

  // ─── Socket ────────────────────────────────────────────────────────────────

  private setupSocketListeners(): void {
    // NgZone ke andar loadTasks call karna zaruri hai taaki Angular ko pata chale
    // ki bahar se (socket se) naya data aaya hai aur UI turant update ho.
    this.subs.push(
      this.socketService.taskCreated$.subscribe(() => {
        this.ngZone.run(() => this.loadTasks());
      }),
      this.socketService.taskUpdated$.subscribe(() => {
        this.ngZone.run(() => this.loadTasks());
      }),
      this.socketService.taskDeleted$.subscribe(() => {
        this.ngZone.run(() => this.loadTasks());
      }),
    );
  }

  // ─── Data ──────────────────────────────────────────────────────────────────

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        // ngZone.run Angular ko force karta hai ki yeh code Zone ke andar hi chale
        this.ngZone.run(() => {
          this.tasks = tasks;
          this.loading = false;
          this.applyFilter();
          this.calculateStats();

          // markForCheck() aur detectChanges() ka combo kisi bhi OnPush block ko tod dega
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.loading = false;
          console.error('Task load error:', err);
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        });
      },
    });
  }

  private calculateStats(): void {
    this.stats.total = this.tasks.length;
    this.stats.todo = this.tasks.filter((t) => t.status === 'todo').length;
    this.stats.inProgress = this.tasks.filter((t) => t.status === 'in-progress').length;
    this.stats.completed = this.tasks.filter((t) => t.status === 'completed').length;
  }

  applyFilter(): void {
    const q = this.searchQuery.toLowerCase().trim();
    this.filteredTasks = this.tasks.filter((t) => {
      const statusMatch = !this.filterStatus || t.status === this.filterStatus;
      const prioMatch = !this.filterPriority || t.priority === this.filterPriority;
      const searchMatch =
        !q || t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q);
      return statusMatch && prioMatch && searchMatch;
    });
  }

  // ─── Actions ───────────────────────────────────────────────────────────────

  updateStatus(task: any, status: string): void {
    const idx = this.tasks.findIndex((t) => t._id === task._id);
    if (idx !== -1) {
      this.tasks[idx] = { ...this.tasks[idx], status };
      this.tasks = [...this.tasks];
      this.applyFilter();
      this.calculateStats();
      this.cdr.detectChanges(); // Optimistic update ke baad UI refresh
    }
    this.taskService.updateTask(task._id, { status }).subscribe({
      error: () => this.loadTasks(),
    });
  }

  deleteTask(id: string): void {
    if (!confirm('Delete this task?')) return;
    this.tasks = this.tasks.filter((t) => t._id !== id);
    this.applyFilter();
    this.calculateStats();
    this.cdr.detectChanges(); // Optimistic remove ke baad UI refresh

    this.taskService.deleteTask(id).subscribe({
      error: () => this.loadTasks(),
    });
  }

  // ... (Baaki saare view helpers same rahenge getPriorityColor, getStatusColor etc.)
  // Unhe maine chheda nahi hai, wo ekdum sahi the.

  getPriorityColor(priority: string): string {
    const map: Record<string, string> = {
      high: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20',
      medium:
        'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20',
      low: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
    };
    return map[priority] ?? 'text-slate-500 bg-slate-100 dark:bg-slate-700';
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      todo: 'text-slate-600 bg-slate-100 dark:bg-slate-700/60 dark:text-slate-300 border border-slate-200 dark:border-slate-600/40',
      'in-progress':
        'text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20',
      completed:
        'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20',
    };
    return map[status] ?? 'text-slate-500 bg-slate-100';
  }

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      todo: 'Todo',
      'in-progress': 'In Progress',
      completed: 'Completed',
    };
    return map[status] ?? status;
  }

  getPriorityDot(priority: string): string {
    const map: Record<string, string> = {
      high: 'bg-red-500',
      medium: 'bg-amber-400',
      low: 'bg-emerald-500',
    };
    return map[priority] ?? 'bg-slate-400';
  }

  trackByTaskId(_: number, task: any): string {
    return task._id;
  }

  getDueDateStatus(dueDate: string, status: string): { label: string; cls: string } | null {
    if (!dueDate || status === 'completed') return null;
    const due = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((due.getTime() - now.setHours(0, 0, 0, 0)) / 86400000);
    if (diffDays < 0)
      return {
        label: 'Overdue',
        cls: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 border border-red-200 dark:border-red-500/20',
      };
    if (diffDays === 0)
      return {
        label: 'Due today',
        cls: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20',
      };
    if (diffDays <= 2)
      return {
        label: `Due in ${diffDays}d`,
        cls: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20',
      };
    return {
      label: `Due ${due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      cls: 'text-slate-500 bg-slate-100 dark:bg-slate-700/60 dark:text-slate-400 border border-slate-200 dark:border-slate-600/40',
    };
  }
}
