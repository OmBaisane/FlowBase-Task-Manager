import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 hidden md:flex flex-col transition-colors duration-300">
      <div class="p-6 flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-br from-[#0f4c5c] to-[#166070] rounded-lg flex items-center justify-center shadow-md">
          <span class="text-white font-bold text-lg">F</span>
        </div>
        <h1 class="text-xl font-bold text-gray-800 dark:text-white tracking-tight">FlowBase</h1>
      </div>

      <nav class="flex-1 px-4 space-y-2 mt-4">
        <a (click)="selectMenu('dashboard')" 
           [class]="currentView === 'dashboard' ? 'bg-[#0f4c5c]/10 text-[#0f4c5c] dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'"
           class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer group">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
           <span class="font-medium">Dashboard</span>
        </a>

        <a (click)="selectMenu('mytasks')" 
           [class]="currentView === 'mytasks' ? 'bg-[#0f4c5c]/10 text-[#0f4c5c] dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'"
           class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer group">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
           <span class="font-medium">My Tasks</span>
        </a>

        <a (click)="selectMenu('feeds')" 
           [class]="currentView === 'feeds' ? 'bg-[#0f4c5c]/10 text-[#0f4c5c] dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'"
           class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer group">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
           <span class="font-medium">Activity Feed</span>
        </a>

        <a (click)="selectMenu('database')" 
           [class]="currentView === 'database' ? 'bg-[#0f4c5c]/10 text-[#0f4c5c] dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'"
           class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer group">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
           <span class="font-medium">Database Status</span>
        </a>

        <a (click)="selectMenu('settings')" 
           [class]="currentView === 'settings' ? 'bg-[#0f4c5c]/10 text-[#0f4c5c] dark:bg-gray-700 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700'"
           class="flex items-center space-x-3 px-4 py-3 rounded-xl transition-all cursor-pointer group">
           <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
           <span class="font-medium">Settings</span>
        </a>
      </nav>

      <div class="p-4 border-t border-gray-100 dark:border-gray-700">
        <div class="bg-gradient-to-r from-[#0f4c5c] to-[#166070] rounded-xl p-4 text-white text-center">
            <p class="text-xs font-medium opacity-80 mb-1">Status</p>
            <p class="font-bold flex items-center justify-center gap-2">
                <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
            </p>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  // Input: Receive current view from App Component
  @Input() currentView: string = 'dashboard';
  
  // Output: Send clicked menu name to App Component
  @Output() menuChange = new EventEmitter<string>();

  selectMenu(menuName: string) {
    this.menuChange.emit(menuName);
  }
}