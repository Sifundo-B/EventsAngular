import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/models/LoginRequest';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    email: '',
    password: '',
    rememberMe: false
  };
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.authService.login(this.loginRequest).subscribe(response => {
      this.loading = false;
      Swal.fire('Success', 'You have successfully logged in!', 'success');
      this.router.navigate(['/home']).then(() => {
        location.reload(); // Reload the page after navigation to show the navbar
      });
    }, error => {
      this.loading = false;
      Swal.fire('Error', 'Login failed: ' + (error.error?.message || 'Check your credentials'), 'error');
    });
  }
}
