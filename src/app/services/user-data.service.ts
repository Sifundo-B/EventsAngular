import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Users } from '../models/Users';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private userSubject = new BehaviorSubject<Users | null>(null);
  user$ = this.userSubject.asObservable();

  updateUser(user: Users) {
    this.userSubject.next(user);
  }
}
