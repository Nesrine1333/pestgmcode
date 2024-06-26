import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../interface/user';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
 private apiUrl = 'http://localhost:3001'

 private loggedInUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) { 
    const savedUser = localStorage.getItem('loggedInUser');
    this.loggedInUserSubject = new BehaviorSubject<User | null>(savedUser ? JSON.parse(savedUser) : null);
  }
  getLoggedInUserObservable(): Observable<User | null> {
    return this.loggedInUserSubject.asObservable();
  }

  login(user: User):Observable<any>{
    return this.http.post(`${this.apiUrl}/login`,user)
  }


  setLoggedInUser(user: User): void {
    this.loggedInUserSubject.next(user);
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }
  saveUser(user: User): void {
    localStorage.setItem('loggedInUser', JSON.stringify(user));
  }

  getUser(): User | null {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
  }

  clearUser(): void {
    localStorage.removeItem('loggedInUser');
  }
}
