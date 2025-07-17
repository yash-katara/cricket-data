import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
private baseUrl = 'http://localhost:2000/api/v2'

  isLoggedIn(): boolean {
    // Logic to check if the user is logged in
    return !!localStorage.getItem('token'); // Example check using localStorage
  }

  constructor( private http:HttpClient) { }
  login(userId: string, password: string):Observable<any>  {
    return this.http.post(`${this.baseUrl}/auth/login`, { userId, password });
  }
}
