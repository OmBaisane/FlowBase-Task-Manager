import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent {
  
  @Output() menuChange = new EventEmitter<string>();
  
  activeTab: string = 'dashboard';

  selectMenu(tabName: string) {
    this.activeTab = tabName;
    this.menuChange.emit(tabName); 
  }
}