import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/app/models/Notification';
import { NotificationService } from 'src/app/services/notification.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  currentFilter: 'all' | 'read' | 'unread' = 'unread';
  unreadCount: number = 0;

  constructor(private notificationService: NotificationService, private webSocketService: WebSocketService) {}

  ngOnInit() {
    this.notificationService.notifications.subscribe(notifications => {
      this.notifications = notifications;
      this.updateUnreadCount();
      this.filterNotifications(this.currentFilter);
    });
    this.webSocketService.notifications.subscribe(notification => {
      this.showNotification(notification);
      this.loadNotifications();  // Reload notifications when a new one is received
    });
  }

 

  loadNotifications() {
    this.notificationService.getNotifications().subscribe(
      (notifications: Notification[]) => {
        this.notifications = notifications;
        this.updateUnreadCount();
        this.filterNotifications(this.currentFilter);
      },
      (error) => {
        console.error('Error loading notifications', error);
      }
    );
  }

  showNotification(message: string): void {
    Swal.fire({
      title: 'New Notification',
      text: message,
      icon: 'info',
      confirmButtonText: 'Okay'
    });
  }

  filterNotifications(filter: 'all' | 'read' | 'unread') {
    this.currentFilter = filter;
    if (filter === 'all') {
      this.filteredNotifications = this.notifications;
    } else if (filter === 'read') {
      this.filteredNotifications = this.notifications.filter(n => n.isRead);
    } else {
      this.filteredNotifications = this.notifications.filter(n => !n.isRead);
    }
  }

  markAsRead(notification: Notification) {
    this.notificationService.markAsRead(notification.id).subscribe(
      () => {
        notification.isRead = true; // Update locally for immediate feedback
        this.updateUnreadCount();
        this.filterNotifications(this.currentFilter); // Reapply filter
      },
      (error) => {
        console.error('Error marking notification as read', error);
      }
    );
  }

  updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    this.notificationService.updateUnreadCount(this.unreadCount);
  }

  readNotification(id: number) {
    this.notificationService.getNotification(id).subscribe(
      (data) => {
        Swal.fire(`Notification: ${data.message}`);
      },
      (error) => {
        console.error('Error reading notification', error);
      }
    );
  }

  deleteNotification(id: number) {
    this.notificationService.deleteNotification(id).subscribe(
      () => {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.updateUnreadCount();
        this.filterNotifications(this.currentFilter);
      },
      (error) => {
        console.error('Error deleting notification', error);
      }
    );
  }
}
