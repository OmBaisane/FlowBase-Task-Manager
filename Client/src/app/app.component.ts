import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router'; 
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
export class AppComponent implements OnInit {
  // --- AUTH STATE ---
  isLoggedIn = false;
  currentUser: string = '';

  // --- APP STATE ---
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

  activityLogs = [
    { time: '10:30 AM', message: 'System Update Completed', type: 'info' },
    { time: '11:15 AM', message: 'New Task Added', type: 'success' },
    { time: '12:00 PM', message: 'Server Load Peak (98%)', type: 'warning' },
    { time: '01:45 PM', message: 'User deleted a task', type: 'danger' }
  ];

  constructor(
    private taskService: TaskService,
    private authService: AuthService, 
    private router: Router, 
    private cd: ChangeDetectorRef,
    public themeService: ThemeService 
  ) {}

  ngOnInit() {
    // Real-Time Auth Listener (Ye hai Jadu!) 🪄
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.isLoggedIn = true;
        this.currentUser = user;
        this.fetchTasks();
        this.router.navigate(['/']); // Dashboard par bhejo
      } else {
        this.isLoggedIn = false;
        this.currentUser = '';
        // Agar user login nahi hai aur register page par nahi hai, to login par bhejo
        if(this.router.url !== '/register') {
           this.router.navigate(['/login']);
        }
      }
    });

    this.taskService.onTaskUpdate(() => {
      if (this.isLoggedIn) this.fetchTasks();
    });
  }

  onMenuChange(menu: string) { this.currentView = menu; this.searchText = ''; }
  toggleDarkMode() { this.themeService.toggleTheme(); }
  
  logout() {
    this.authService.logout(); // Ye automatically listener trigger karega
  }

  get filteredTasks() {
    if (!this.searchText) return this.tasks;
    const s = this.searchText.toLowerCase();
    return this.tasks.filter(t => (t.title?.toLowerCase().includes(s) || t.username?.toLowerCase().includes(s)));
  }

  get myTasks() { 
    return this.tasks.filter(t => t.username.toLowerCase() === this.currentUser.toLowerCase()); 
  }

  calculateStats() {
    this.totalTasks = this.tasks.length;
    this.activeTasksCount = this.tasks.filter(t => t.status === 'Pending' || t.status === 'In Progress').length;
    const completed = this.tasks.filter(t => t.status === 'Completed').length;
    this.completionRate = this.totalTasks > 0 ? Math.round((completed / this.totalTasks) * 100) : 0;
  }

  fetchTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => { this.tasks = data; this.calculateStats(); this.cd.detectChanges(); },
      error: (err) => console.error('Error Fetching Tasks:', err)
    });
  }
  
  openModal() { 
    this.isModalOpen = true; 
    this.isEditing = false; 
    this.newTask = { title: '', username: this.currentUser, status: 'Pending' }; 
  }

  openEditModal(task: any) { 
    this.isModalOpen = true; 
    this.isEditing = true; 
    this.currentTaskId = task._id; 
    this.newTask = { ...task }; 
  }
  
  closeModal() { this.isModalOpen = false; this.isEditing = false; }

  saveTask() {
    if (!this.newTask.title) { alert('Please enter a task title!'); return; }
    this.newTask.username = this.currentUser;

    if (this.isEditing) {
      this.taskService.updateTask(this.currentTaskId, this.newTask).subscribe({
        next: (res) => {
           const i = this.tasks.findIndex(t => t._id === this.currentTaskId);
           if(i !== -1) this.tasks[i] = res;
           this.calculateStats(); this.closeModal(); alert("Updated! ✏️"); this.cd.detectChanges();
        }
      });
    } else {
      this.taskService.createTask(this.newTask).subscribe({
        next: (res) => { this.tasks.unshift(res); this.calculateStats(); this.closeModal(); alert("Added! ✅"); this.cd.detectChanges(); }
      });
    }
  }

  deleteTask(id: any) {
    if(confirm("Delete this task?")) {
      const backup = [...this.tasks];
      this.tasks = this.tasks.filter(t => t._id !== id); this.calculateStats(); this.cd.detectChanges();
      this.taskService.deleteTask(id).subscribe({ error: () => { alert("Error!"); this.tasks = backup; this.calculateStats(); } });
    }
  }

  updateProfile() { alert("Profile Updated Successfully! (Demo Only)"); }
}