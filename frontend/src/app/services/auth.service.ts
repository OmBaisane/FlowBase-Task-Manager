import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API_URL = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, data);
  }
}
