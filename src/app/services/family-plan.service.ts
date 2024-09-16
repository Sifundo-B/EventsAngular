
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubscriptionPlan } from '../models/SubscriptionPlans';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FamilyPlanService {

  private apiUrl = `${environment.apiUrl}/subscriptions`;

  constructor(private http: HttpClient) { }

  getFamilyPlanById(id: number): Observable<SubscriptionPlan> {
    const url = `${this.apiUrl}/${id}`
    return this.http.get<SubscriptionPlan>(url);
  }
}

