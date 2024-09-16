import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { DeviceService } from './device.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PayPalService {
  private baseUrl = `${environment.apiUrl}/paypal`;

  constructor(
    private http: HttpClient,
    private deviceService: DeviceService
  ) {}

  createOrder(amount: number, eventId: number): Observable<{ approvalLink: string }> {
    const isMobile = this.deviceService.isMobile();
    return this.http.post<{ approvalLink: string }>(`${this.baseUrl}/create-order`, { amount, eventId, isMobile });
  }

  executeOrder(paymentId: string, payerId: string, eventId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/execute-order`, {  
      params: new HttpParams()
        .set('paymentId', paymentId)
        .set('PayerID', payerId)
        .set('eventId', eventId.toString())
    }).pipe(
      switchMap(response => {
        if (response && response.message) {
          return this.deductTicket(eventId);
        } else {
          throw new Error('Payment execution failed');
        }
      })
    );
  }

  deductTicket(eventId: number): Observable<any> {
    const eventUrl = `${environment.apiUrl}/events/${eventId}/deduct-ticket`;
    return this.http.put<any>(eventUrl, {});
  }
}
