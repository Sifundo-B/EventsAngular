import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { RegisterRequest } from '../models/RegisterRequest';
import { LoginRequest } from '../models/LoginRequest';
import { AuthenticationResponse } from '../models/AuthenticationResponse';
import { Router } from '@angular/router';
import { SubscriptionPlan } from '../models/SubscriptionPlans';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  private refreshTokenInProgress = false;
  authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient, private router: Router) {}

  // Get the current user details from the token
  getCurrentUser() {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      return {
        id: decodedToken.id,
        firstName: decodedToken.firstName,
        lastName: decodedToken.lastName,
        email: decodedToken.email
      };
    }
    return null;
  }


  getSubscriptionDetails(): Observable<SubscriptionPlan> {
    const token = this.getToken();
    if (!token) {
      return throwError('No token available');
    }

    const headers = this.addAuthorizationHeader(new HttpHeaders());

    return this.http.get<SubscriptionPlan>(`${this.baseUrl}/subscriptions/current`, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching subscription details:', error.message);
          return throwError('Failed to fetch subscription details');
        })
      );
  }
// Register a new user
  register(registerRequest: RegisterRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/register`, registerRequest)
      .pipe(
        tap(response => {
          this.setToken(response.token, true);  // Default to long-lived token for registration
          this.setRefreshToken(response.refreshToken, true);
          this.authStatus.next(true); // Notify that user is logged in
        }),
        catchError(this.handleError)
      );
  }
// Login a user
  login(loginRequest: LoginRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, loginRequest)
      .pipe(
        tap(response => {
          const rememberMe = loginRequest.rememberMe ?? false; // Provide default value for rememberMe
          this.setToken(response.token, rememberMe);
          this.setRefreshToken(response.refreshToken, rememberMe);
          this.authStatus.next(true); // Notify that user is logged in
        }),
        catchError(this.handleError)
      );
  }

  refreshToken(refreshToken: string): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap(response => {
          this.setToken(response.token, this.isTokenInLocalStorage());
          this.setRefreshToken(response.refreshToken, this.isTokenInLocalStorage());
        }),
        catchError(this.handleError)
      );
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/forgot-password`, { email })
      .pipe(catchError(this.handleError));
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reset-password`, { token, newPassword })
      .pipe(catchError(this.handleError));
  }
// Set JWT token in localStorage or sessionStorage
  setToken(token: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      localStorage.setItem('jwt_token', token);
    } else {
      sessionStorage.setItem('jwt_token', token);
    }
  }
// Set refresh token in localStorage or sessionStorage
  setRefreshToken(refreshToken: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      localStorage.setItem('refresh_token', refreshToken);
    } else {
      sessionStorage.setItem('refresh_token', refreshToken);
    }
  }


  getToken(): string | null {
    return localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
  }
// Clear the JWT token from storage
  clearToken(): void {
    localStorage.removeItem('jwt_token');
    sessionStorage.removeItem('jwt_token');
  }
// Clear the refresh token from storage
  clearRefreshToken(): void {
    localStorage.removeItem('refresh_token');
    sessionStorage.removeItem('refresh_token');
  }

  private isTokenInLocalStorage(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUsername(): string | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded ? decoded.firstName : null;
    }
    return null;
  }
// Get the current user's ID from the token
  getUserId(): Observable<number> {
    const token = this.getToken();
    if (!token) {
      return throwError('No token available');
    }

    return this.http.get<any>(`${this.baseUrl}/current-user`, { headers: { Authorization: `Bearer ${token}` } }).pipe(
      tap(response => {
        console.log('User ID response:', response);
      }),
      map(response => response.id),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          console.error('User is not authorized to access this resource.');
        } else {
          console.error('Error fetching user ID:', error.message);
        }
        return throwError('Failed to fetch user ID');
      })
    );
  }

// Logout the user by clearing tokens and redirecting to signin page
  logout(): void {
    this.clearToken();
    this.clearRefreshToken();
    localStorage.removeItem('username');
    this.router.navigate(['/signin']);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.error.message);
    return throwError(error.error.message);
  }

  getCurrentUserId(): number | null {
    return 1; // Replace this with your logic to get the logged-in user's ID
  }

  private addAuthorizationHeader(headers: HttpHeaders): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
  }
// Check if the user is authenticated (token exists)
isAuthenticated(): boolean {
  return !!this.getToken();
}
  private refreshTokenIfNeeded(): Observable<AuthenticationResponse> {
    if (this.refreshTokenInProgress) {
      return new Observable<AuthenticationResponse>(observer => {
        observer.complete();
      });
    }
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
      this.refreshTokenInProgress = true;
      return this.refreshToken(token).pipe(
        tap(() => this.refreshTokenInProgress = false)
      );
    } else {
      return new Observable<AuthenticationResponse>(observer => {
        observer.complete();
      });
    }
  }

  private isTokenExpired(token: string): boolean {
    const expirationDate = this.getTokenExpirationDate(token);
    return expirationDate ? expirationDate < new Date() : false;
  }

  private getTokenExpirationDate(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  }

  extractUserIdFromToken(): number | null {
    const token = this.getToken();
    if (token) {
      const decoded = this.decodeToken(token);
      return decoded ? decoded.id : null;
    }
    return null;
  }

 // Method to decode the token and extract roles
 private decodeToken(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

// Get the user roles from the token
getRole(): string[] | null {
  const token = this.getToken();
  if (token) {
    const decoded = this.decodeToken(token);
    // Access 'roles' using bracket notation
    return decoded && decoded['roles'] ? decoded['roles'] : null;
  }
  return null;
}

// Check if the user has any of the specified roles
hasRole(roles: string[]): boolean {
  const userRoles = this.getRole();
  if (!userRoles) return false;
  return roles.some(role => userRoles.includes(role));
}

isAdmin(): boolean {
  const token = this.getToken();
  if (token) {
    const decodedToken = this.decodeToken(token);
    // Access 'roles' using bracket notation
    return decodedToken && decodedToken['roles'] && decodedToken['roles'].includes('Admin');
  }
  return false;
}

  isOrganizer(): boolean {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken && decodedToken.roles.includes('Organizer');
    }
    return false;
  }
// Check if the user is an attendee
  isAttendee(): boolean {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.decodeToken(token);
      return decodedToken && decodedToken.roles.includes('Attendee');
    }
    return false;
  }

  addUserToPlan(userId: number, subscriptionPlanId: number): Observable<SubscriptionPlan> {
    const url = `${this.baseUrl}/subscriptions/${userId}`;
    return this.http.post<SubscriptionPlan>(url, subscriptionPlanId, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`
      })
    }).pipe(
      catchError(this.handleError)
    );
  }
}
