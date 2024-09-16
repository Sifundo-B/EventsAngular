import { Injectable } from '@angular/core';
import { SubscriptionPlan } from '../models/SubscriptionPlans';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndividualPlanService {

  private apiUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) { }

  getIndividualById(id: number): Observable<SubscriptionPlan> {
    const url = `${this.apiUrl}/${id}`
    return this.http.get<SubscriptionPlan>(url);
  }

  
}
