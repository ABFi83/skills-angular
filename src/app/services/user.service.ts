import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UserResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) {}

  login(username: string, password: string): Observable<{token: string}> {
    return this.apiService.post<{token: string}>('/users/login', { username, password });
  }

  getUser(): Observable<UserResponse> {
    return this.apiService.get<UserResponse>('/user');
  }

  getUsers(searchQuery: string): Observable<UserResponse[]> {
    return this.apiService.get<UserResponse[]>(`/users?search=${searchQuery}`);
  }
}
