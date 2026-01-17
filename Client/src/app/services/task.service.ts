import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface Task {
  _id?: string;
  title: string;
  username: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/tasks';
  private socket: Socket; // Socket Variable

  constructor(private http: HttpClient) {
    // 1. Connect to Server
    this.socket = io('http://localhost:5000'); 
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  // --- REAL TIME LISTENER ---
  onTaskUpdate(callback: () => void) {
    this.socket.on('task-updated', () => {
      console.log("Real-time Signal Mila! 🔄");
      callback(); 
    });
  }
}