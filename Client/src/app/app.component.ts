import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TaskService, Task } from './services/task.service';
import { ThemeService } from './services/theme.service';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent, LoginComponent, RegisterComponent],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  // --- AUTH STATE ---
  isLoggedIn = false;
  showRegister = false;

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

  // --- DUMMY LOGS ---
  activityLogs = [
    { time: '10:30 AM', message: 'System Update Completed', type: 'info' },
    { time: '11:15 AM', message: 'New Task Added', type: 'success' },
    { time: '12:00 PM', message: 'Server Load Peak (98%)', type: 'warning' },
    { time: '01:45 PM', message: 'User deleted a task', type: 'danger' }
  ];

  constructor(
    private taskService: TaskService,
    private cd: ChangeDetectorRef,
    public themeService: ThemeService 
  ) {}

  ngOnInit() {
    // Login nahi hai, toh data fetch mat karo abhi
  }

  // --- AUTH FUNCTIONS ---
  handleLogin(success: boolean) {
    if (success) {
      this.isLoggedIn = true;
      this.fetchTasks(); // Data ab load karo
    }
  }

  toggleRegister(show: boolean) {
    this.showRegister = show;
  }

  // --- CRUD & LOGIC ---
  onMenuChange(menu: string) { this.currentView = menu; this.searchText = ''; }
  toggleDarkMode() { this.themeService.toggleTheme(); }

  get filteredTasks() {
    if (!this.searchText) return this.tasks;
    const s = this.searchText.toLowerCase();
    return this.tasks.filter(t => (t.title?.toLowerCase().includes(s) || t.username?.toLowerCase().includes(s)));
  }

  get myTasks() { return this.tasks.filter(t => t.username.toLowerCase().includes('rahul')); }

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
  
  openModal() { this.isModalOpen = true; this.isEditing = false; this.newTask = { title: '', username: '', status: 'Pending' }; }
  openEditModal(task: any) { this.isModalOpen = true; this.isEditing = true; this.currentTaskId = task._id; this.newTask = { ...task }; }
  closeModal() { this.isModalOpen = false; this.isEditing = false; }

  saveTask() {
    if (!this.newTask.title || !this.newTask.username) { alert('Please fill all details!'); return; }
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