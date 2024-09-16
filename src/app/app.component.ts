import { Component, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Eventiefy';
  isDesktop = true;
  isLoggedIn = false;
  username: string | null = null;

  constructor(private authService: AuthService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  ngOnInit() {
    this.checkScreenSize();
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  checkScreenSize() {
    this.isDesktop = window.innerWidth >= 768;
  }

  logout() {
    this.authService.logout();
  }
  
}
