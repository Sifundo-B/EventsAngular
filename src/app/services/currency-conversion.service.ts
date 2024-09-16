import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyConversionService {

  private conversionApiUrl = 'https://api.exchangerate-api.com/v4/latest/ZAR'; // Example API, you might need to replace with a different one

  constructor(private http: HttpClient) {}

  convertToUSD(amountInZAR: number): Observable<number> {
    return this.http.get<any>(this.conversionApiUrl).pipe(
      map(response => {
        const usdRate = response.rates.USD;
        return amountInZAR * usdRate;
      })
    );
  }}
