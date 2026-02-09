import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router'; 
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs'; 

// Components & Services
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TaskService, Task } from './services/task.service';
import { ThemeService } from './services/theme.service';
import { AuthService } from './services/auth.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, HeaderComponent, SidebarComponent],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit, OnDestroy {
  // --- AUTHENTICATION & SUBSCRIPTIONS ---
  private authSub: Subscription | undefined;
  isLoggedIn = false;
  currentUser: string = '';

  // --- RESPONSIVE STATE ---
  isMobileMenuOpen = false;

  // --- APPLICATION STATE ---
  title = 'FlowBase';
  tasks: Task[] = [];
  searchText: string = '';
  totalTasks = 0;
  activeTasksCount = 0;
  completionRate = 0;
  currentView: string = 'dashboard';

  // --- MODAL STATE ---
  isModalOpen = false;
  isEditing = false;
  currentTaskId = '';
  newTask: Task = { title: '', username: '', status: 'Pending' };

  // --- ACTIVITY LOGS ---
  activityLogs: any[] = [
    { time: 'System', message: 'FlowBase System Initialized', type: 'info' }
  ];

  constructor(
    private taskService: TaskService,
    private authService: AuthService, 
    private router: Router, 
    private cd: ChangeDetectorRef,
    public themeService: ThemeService 
  ) {}

  ngOnInit() {
    // Auth Listener
    this.authSub = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.currentUser = user;
        this.fetchTasks();
        if (this.router.url === '/login') this.router.navigate(['/']);
      } else {
        this.isLoggedIn = false;
        this.currentUser = '';
        if (this.router.url !== '/register') this.router.navigate(['/login']);
      }
    });

    // Real-time Socket Listener
    this.taskService.onTaskUpdate(() => {
      if (this.isLoggedIn) {
        this.fetchTasks();
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
  }

  // --- HELPER FUNCTIONS ---
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  addLog(msg: string, type: string = 'success') {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.activityLogs.unshift({ time: timeStr, message: msg, type: type });
    if (this.activityLogs.length > 8) this.activityLogs.pop(); 
  }

  onMenuChange(menu: string) { 
    this.currentView = menu; 
    this.searchText = ''; 
    this.isMobileMenuOpen = false; // Auto-close menu on mobile
    this.cd.detectChanges();
  }

  toggleDarkMode() { this.themeService.toggleTheme(); }

  openNotifications() {
    this.currentView = 'feeds';
    this.addLog("User checked notifications", "info");
  }
  
  logout() {
    if(confirm("Are you sure you want to log out?")) {
      this.authService.logout();
    }
  }

  // --- TASK MANAGEMENT LOGIC ---

  get filteredTasks() {
    if (!this.searchText) return this.tasks;
    const s = this.searchText.toLowerCase();
    return this.tasks.filter(t => 
      t.title?.toLowerCase().includes(s) || 
      t.username?.toLowerCase().includes(s) ||
      t.status?.toLowerCase().includes(s)
    );
  }

  get myTasks() { 
    return this.tasks.filter(t => t.username.toLowerCase() === this.currentUser.toLowerCase()); 
  }

  calculateStats() {
    this.totalTasks = this.tasks.length;
    const active = this.tasks.filter(t => t.status !== 'Completed');
    this.activeTasksCount = active.length;
    const completed = this.totalTasks - active.length;
    this.completionRate = this.totalTasks > 0 ? Math.round((completed / this.totalTasks) * 100) : 0;
  }

  fetchTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => { 
        this.tasks = data; 
        this.calculateStats(); 
        this.cd.detectChanges(); 
      },
      error: (err) => console.error('API Fetch Error:', err)
    });
  }
  
  // Modal Handlers
  openModal() { 
    this.isModalOpen = true; 
    this.isEditing = false; 
    this.newTask = { title: '', username: this.currentUser, status: 'Pending' }; 
  }

  openEditModal(task: any) { 
    this.isModalOpen = true; 
    this.isEditing = true; 
    this.currentTaskId = task._id; 
    // Clone object to avoid reference issues
    this.newTask = { ...task }; 
  }
  
  closeModal() { 
    this.isModalOpen = false; 
    this.isEditing = false; 
  }

  // CRUD Operations
  saveTask() {
    if (!this.newTask.title.trim()) { 
      alert('Task title is required.'); 
      return; 
    }

    // Sanitize Payload: Only send necessary fields to prevent 400 Bad Request
    const cleanPayload: Task = {
      title: this.newTask.title,
      username: this.currentUser,
      status: this.newTask.status
    };

    if (this.isEditing) {
      this.taskService.updateTask(this.currentTaskId, cleanPayload).subscribe({
        next: (res) => {
          this.addLog(`Updated task: "${res.title}"`, 'info');
          this.fetchTasks(); 
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          console.error("Update Error:", err);
          alert(`Update Failed: ${err.error.message || err.message}`);
        }
      });
    } else {
      this.taskService.createTask(cleanPayload).subscribe({
        next: (res) => {
          this.addLog(`Created new task`, 'success');
          this.tasks.unshift(res); 
          this.calculateStats(); 
          this.closeModal();
        },
        error: (err: HttpErrorResponse) => {
          console.error("Creation Error:", err);
          alert(`Creation Failed: ${err.error.message || err.message}`);
        }
      });
    }
  }

  deleteTask(id: any) {
    if(confirm("Permanently delete this task?")) {
      // Optimistic UI update
      const previousTasks = [...this.tasks];
      this.tasks = this.tasks.filter(t => t._id !== id); 
      this.calculateStats();

      this.taskService.deleteTask(id).subscribe({
        next: () => this.addLog(`Deleted task`, 'danger'),
        error: () => { 
          alert("Server Error. Reverting changes."); 
          this.tasks = previousTasks; // Rollback
          this.calculateStats();
        }
      });
    }
  }

  updateProfile() { 
    alert("System Version: 1.0.0 (Stable)"); 
  }
}