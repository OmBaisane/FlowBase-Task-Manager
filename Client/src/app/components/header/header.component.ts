import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header
      class="h-20 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-8 transition-colors duration-300"
    >
      <div
        class="flex items-center bg-gray-50 dark:bg-gray-700 rounded-xl px-4 py-2.5 w-96 border border-gray-100 dark:border-gray-600 focus-within:ring-2 focus-within:ring-[#0f4c5c] transition-all"
      >
        <svg
          class="w-5 h-5 text-gray-400 dark:text-gray-300 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
        <input
          type="text"
          placeholder="Search tasks, projects..."
          class="bg-transparent border-none outline-none text-gray-600 dark:text-gray-200 w-full placeholder-gray-400 font-medium"
          (input)="onSearch($event)"
        />
      </div>

      <div class="flex items-center space-x-6">
        <button
          (click)="toggleTheme.emit()"
          class="p-2 text-gray-400 hover:text-[#0f4c5c] dark:hover:text-white transition-colors relative"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            ></path>
          </svg>
        </button>

        <button
          class="p-2 text-gray-400 hover:text-[#0f4c5c] dark:hover:text-white transition-colors relative"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            ></path>
          </svg>
          <span
            class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"
          ></span>
        </button>

        <div class="flex items-center space-x-3 pl-6 border-l border-gray-100 dark:border-gray-700">
          <div class="text-right hidden md:block">
            <p class="text-sm font-bold text-gray-800 dark:text-white">{{ username }}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">Admin</p>
          </div>

          <div class="relative group cursor-pointer">
            <div
              class="w-10 h-10 bg-gradient-to-tr from-[#0f4c5c] to-[#26a0b8] rounded-full flex items-center justify-center text-white font-bold shadow-md transform group-hover:scale-105 transition-transform"
            >
              {{ username.charAt(0).toUpperCase() }}
            </div>

            <div class="absolute right-0 top-full pt-4 w-40 hidden group-hover:block z-50">
              <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <button
                  (click)="logout()"
                  class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  // Input: Receive username from App Component
  @Input() username: string = 'Guest';

  // Output: Send events to App Component
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() searchChange = new EventEmitter<string>();

  constructor(private authService: AuthService, private router: Router) {}

  onSearch(event: any) {
    // Extract text value from event and emit string
    this.searchChange.emit(event.target.value);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    // Optional: Reload to clear state
    setTimeout(() => window.location.reload(), 100);
  }
}
