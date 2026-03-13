import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getStats() {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  createTask(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

  updateTask(id: string, data: any) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data);
  }

  deleteTask(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
