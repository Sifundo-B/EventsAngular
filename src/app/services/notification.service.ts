import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { Notification } from '../models/Notification';
import { WebSocketService } from './web-socket.service';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private baseUrl = `${environment.apiUrl}/notification`;

  private notificationsSubject: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCount.asObservable();

  constructor(private http: HttpClient, private webSocketService: WebSocketService, private authService: AuthService) {
    this.webSocketService.notifications.subscribe(_notification => {
      this.fetchNotifications();  // Refresh notifications on receiving new one
    });
    this.fetchNotifications();  // Ensure notifications are fetched on service initialization
  }

  updateUnreadCount(count: number) {
    this.unreadCount.next(count);
  }

  getNotifications(): Observable<Notification[]> {
    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) {
      // Handle the case where userId is undefined (e.g., user is not logged in)
      return new Observable<Notification[]>(observer => {
        observer.next([]);
        observer.complete();
      });
    }
    return this.http.get<Notification[]>(`${this.baseUrl}/user/${userId}`);
  }

  getNotification(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.baseUrl}/${id}`);
  }

  markAsRead(id: number): Observable<Notification> {
    return this.http.put<Notification>(`${this.baseUrl}/${id}/read`, { isRead: true }).pipe(
      tap(() => {
        localStorage.setItem(`notification_${id}_read`, 'true'); // Mark as read in localStorage
        this.fetchNotifications(); // Refresh notifications after marking as read
      })
    );
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.fetchNotifications()) // Refresh notifications after deletion
    );
  }

  private fetchNotifications(): void {
    this.getNotifications().subscribe(notifications => {
      notifications.forEach(notification => {
        const readState = localStorage.getItem(`notification_${notification.id}_read`);
        notification.isRead = readState === 'true';
      });
      this.notificationsSubject.next(notifications);
      this.updateUnreadCount(notifications.filter(n => !n.isRead).length);
    }, error => {
      console.error('Error fetching notifications:', error);
    });
  }

  get notifications(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }
}
