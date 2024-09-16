import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaymentMethod } from '../models/PaymentMethod';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

/**
 * Service for managing payment methods.
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {
  /**
   * API URL for payment methods.
   */
  private apiUrl = `${environment.apiUrl}/payment-methods`;

  /**
   * Constructor.
   * @param http - HttpClient instance.
   */
  constructor(private http: HttpClient) { }

  /**
   * Retrieves all payment methods.
   */
  getAllPaymentMethods(): Observable<PaymentMethod[]> {
    return this.http.get<PaymentMethod[]>(this.apiUrl);
  }

  /**
   * Retrieves a payment method by ID.
   */
  getPaymentMethodById(id: number): Observable<PaymentMethod> {
    return this.http.get<PaymentMethod>(`${this.apiUrl}/${id}`);
  }

  /**
   * Creates a new payment method
   */
  createPaymentMethod(paymentMethod: PaymentMethod): Observable<PaymentMethod> {
    return this.http.post<PaymentMethod>(this.apiUrl, paymentMethod);
  }

  /**
   * Deletes a payment method by ID.
   */
  deletePaymentMethod(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}