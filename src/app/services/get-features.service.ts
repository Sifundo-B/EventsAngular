import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feature } from '../models/Feature';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GetFeaturesService {

 

  constructor(private http: HttpClient) { }

  private apiUrl = `${environment.apiUrl}/features/all`;



  getFeatures(planName: string): Observable<Feature[]> {
    return this.http.get<Feature[]>(this.apiUrl);
  }
  }

