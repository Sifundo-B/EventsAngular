import { Component } from '@angular/core';
import { Router } from '@angular/router'; 
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.scss']
})
export class NotAuthorizedComponent {
  constructor(private router: Router, private authService: AuthService) {}

  goBack(): void {
    const userRoles = this.authService.getRole();
    console.log("Role: ", userRoles);

    // Explicitly check for null or an empty array
    if (userRoles && userRoles.length > 0) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/signin']);
    }
  }
}
