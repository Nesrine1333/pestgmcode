import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interface/user';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  private apiUrl = 'http://localhost:3001'
  constructor(private http: HttpClient) { }
  signup(user: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, user);
  }
}
