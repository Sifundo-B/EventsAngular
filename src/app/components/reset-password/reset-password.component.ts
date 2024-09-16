import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailServiceService } from 'src/app/services/email-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  token: string;
  newPassword: string = ''; // Initialize newPassword
  message: string = ''; // Initialize message

  constructor(private route: ActivatedRoute, private emailService: EmailServiceService, private router: Router) {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  resetPassword() {
    this.emailService.resetPassword(this.token, this.newPassword).subscribe(
      response => {
        this.message = 'Password reset successfully!';
        Swal.fire('Success', this.message, 'success');
        this.router.navigate(['/signin']); // Navigate to signin

      },
      error => {
        this.message = 'Failed to reset password';
        Swal.fire('Error', this.message, 'error');
      }
    );
  }
}
