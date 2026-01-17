import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/auth'; 
  
  // "News Channel" - Jo batayega user login hai ya nahi
  private currentUserSubject = new BehaviorSubject<string | null>(this.getUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, user).pipe(
      tap((res: any) => {
        // Login success hote hi News Broadcast karo
        this.saveUser(res.username);
        this.currentUserSubject.next(res.username);
      })
    );
  }

  saveUser(username: string) {
    localStorage.setItem('username', username);
  }

  getUser() {
    return localStorage.getItem('username');
  }

  logout() {
    localStorage.removeItem('username');
    this.currentUserSubject.next(null); 
  }
}