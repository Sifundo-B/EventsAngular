import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Users } from '../models/Users';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PremiumUsersService {

  private baseUrl = `${environment.apiUrl}/premiumUsers`;
  constructor(private http: HttpClient) { }

  getAllPremiumUsers(): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.baseUrl}`).pipe(
      catchError(this.handleError)
    );
  }

  getPremiumUsersByPackageType(packageType: string): Observable<Users[]> {
    return this.http.get<Users[]>(`${this.baseUrl}/package-type/${packageType}`).pipe(
      catchError(this.handleError)
    );
  }

  upgradeUserToPremium(userId: number, packageType: string): Observable<string> {
    const params = new HttpParams().set('packageType', packageType);
    return this.http.post<string>(`${this.baseUrl}/upgrade/${userId}`, {}, { params }).pipe(
      catchError(this.handleError)
    );
  }

  downgradeUserFromPremium(userId: number): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/downgrade/${userId}`, {}).pipe(
      catchError(this.handleError)
    );
  }
  

  updateUserSubscriptionStatus(userId: number, isPremium: boolean, packageType: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/update-subscription`, { userId, isPremium, packageType }).pipe(
      catchError(this.handleError)
    );
  }

  manageUserAccess(userId: number, grantAccess: boolean): Observable<string> {
    const params = new HttpParams().set('grantAccess', grantAccess.toString());
    return this.http.post<string>(`${this.baseUrl}/access/${userId}`, {}, { params }).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
