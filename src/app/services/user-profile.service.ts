import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service'; 
import { Users } from '../models/Users'; 
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root' // Angular service is provided in root injector
})
export class UserProfileService {

  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUser(id: number): Observable<Users> {
    return this.http.get<Users>(`${this.baseUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateUser(id: number, formData: FormData): Observable<Users> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('No token found.');
    }
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.put<Users>(`${this.baseUrl}/${id}`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error.message);
    console.error('Status:', error.status);
    console.error('Error body:', error.error);
    return throwError(() => new Error('Something bad happened; please try again later.'));
}
}
