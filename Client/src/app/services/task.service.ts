import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface Task {
  _id?: string;
  title: string;
  username: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Base URL ko ek hi jagah rakhein taaki change karna asaan ho
  private readonly BASE_URL = 'http://localhost:5000';
  private readonly API_URL = `${this.BASE_URL}/tasks`;
  private socket: Socket;

  constructor(private http: HttpClient) {
    this.socket = io(this.BASE_URL); 
  }

  // --- API CALLS ---
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.API_URL);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.API_URL, task);
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  updateTask(id: string, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${id}`, task);
  }

  // --- REAL TIME LISTENER ---
  onTaskUpdate(callback: () => void) {
    this.socket.on('task-updated', () => {
      // Viva Tip: Socket server se signal aate hi frontend automatically refresh hota hai
      callback(); 
    });
  }
}