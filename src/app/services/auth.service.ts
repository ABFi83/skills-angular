import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, EMPTY } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { UserService } from './user.service';
import { UserResponse } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  private userSubject = new BehaviorSubject<UserResponse | null>(null);

  public token$ = this.tokenSubject.asObservable();
  public user$ = this.userSubject.asObservable();
  public isAuthenticated$ = this.token$.pipe(map(token => !!token));

  constructor(private userService: UserService) {
    // Initialize user if token exists
    if (this.tokenSubject.value) {
      this.loadUser();
    }
  }

  private loadUser(): void {
    this.userService.getUser().pipe(
      catchError(() => {
        this.logout();
        return EMPTY;
      })
    ).subscribe(user => {
      this.userSubject.next(user);
    });
  }

  login(username: string, password: string): Observable<boolean> {
    return this.userService.login(username, password).pipe(
      switchMap(response => {
        const token = response.token;
        localStorage.setItem('token', token);
        this.tokenSubject.next(token);

        return this.userService.getUser();
      }),
      map(user => {
        this.userSubject.next(user);
        return true;
      }),
      catchError(error => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  get currentUser(): UserResponse | null {
    return this.userSubject.value;
  }

  get currentToken(): string | null {
    return this.tokenSubject.value;
  }
}
