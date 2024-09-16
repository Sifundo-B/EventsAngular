import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from 'src/app/models/Notification';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  notifications: Notification[] = [];
  unreadCount: number = 0;
  showNotifications: boolean = false;
  username: string | null = null;
  isLoggedIn = false;
  isDropdownOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router, private notificationService: NotificationService) {
    this.username = localStorage.getItem('username');
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.notificationService.notifications.subscribe(notifications => {
      this.notifications = notifications;
      this.updateUnreadCount();
    });
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.router.navigate(['/signin']);
  }

  isAttendeeOrOrganizer(): boolean {
    return this.authService.isAdmin() || this.authService.isOrganizer();
  }

  onlyAttendee(): boolean {
    return this.authService.isAttendee();
  }

  updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    this.notificationService.updateUnreadCount(this.unreadCount);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.flex.items-center.justify-center.mx-4.md\\:hidden');
    if (!clickedInside) {
      this.closeDropdown();
    }
  }
}
