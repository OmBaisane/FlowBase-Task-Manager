import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
      
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div class="absolute -top-24 -left-24 w-96 h-96 bg-[#0f4c5c] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div class="absolute top-0 -right-4 w-72 h-72 bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div class="absolute -bottom-8 left-20 w-72 h-72 bg-pink-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div class="relative z-10 bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        
        <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-[#0f4c5c] to-[#26a0b8] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span class="text-3xl font-bold text-white">F</span>
            </div>
            <h2 class="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p class="text-gray-400 mt-2">Sign in to continue to FlowBase</p>
        </div>

        <div class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    <input [(ngModel)]="username" type="text" class="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent transition-all" placeholder="Enter your username">
                </div>
            </div>

            <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    </div>
                    <input [(ngModel)]="password" type="password" class="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0f4c5c] focus:border-transparent transition-all" placeholder="••••••••">
                </div>
            </div>

            <button (click)="onLogin()" class="w-full bg-gradient-to-r from-[#0f4c5c] to-[#166070] hover:from-[#0c3b47] hover:to-[#12505c] text-white font-bold py-3 px-4 rounded-xl shadow-lg transform transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f4c5c] focus:ring-offset-gray-900">
                Sign In
            </button>
        </div>

        <p class="mt-8 text-center text-sm text-gray-400">
            Don't have an account? 
            <a routerLink="/register" class="text-[#26a0b8] hover:text-white font-medium transition-colors cursor-pointer">Create Account</a>
        </p>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    if(!this.username || !this.password) {
      alert("Please fill all fields");
      return;
    }
    const user = { username: this.username, password: this.password };
    this.authService.login(user).subscribe({
      error: (err: any) => {
        alert(err.error?.message || "Login Failed");
      }
    });
  }
}