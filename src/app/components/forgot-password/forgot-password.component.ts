import { Component } from '@angular/core';
import { EmailServiceService } from 'src/app/services/email-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = ''; // Initialize email
  message: string = ''; // Initialize message

  constructor(private emailService: EmailServiceService, private router: Router) { }

  sendResetEmail() {
    this.emailService.sendResetEmail(this.email).subscribe(
      response => {
        this.message = response.message; // Ensure we get the message from response
        Swal.fire('Success', this.message, 'success').then(() => {
          this.router.navigate(['/signin']); // Navigate to signin
        });
      },
      error => {
        this.message = error.error.message || 'Failed to send password reset email'; // Ensure we get the message from error response
        Swal.fire('Error', this.message, 'error');
      }
    );
  }
}
