import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Role } from 'src/app/models/Role'; // Adjust the path as necessary

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  roles = [Role.Attendee, Role.Admin, Role.Organizer];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.passwordValidator]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordValidator(control: AbstractControl) {
    const value = control.value;
    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const validLength = value ? value.length >= 8 : false;

    if (!hasNumber || !hasUpper || !hasLower || !hasSpecial || !validLength) {
      return { passwordStrength: true };
    }
    return null;
  }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password')!.value === formGroup.get('confirmPassword')!.value
      ? null
      : { passwordMismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const registerRequest = {
      ...this.registerForm.value,
      role: this.registerForm.value.role as Role // Ensure role is cast correctly
    };

    this.authService.register(registerRequest).subscribe(
      response => {
        console.log('User registered successfully', response);
        // Automatically log in the user after successful registration
        this.authService.login({ email: this.registerForm.value.email, password: this.registerForm.value.password }).subscribe(
          loginResponse => {
            this.authService.setToken(loginResponse.token);
            this.authService.setRefreshToken(loginResponse.refreshToken);
            Swal.fire('Success', 'You have successfully registered and logged in!', 'success');
            this.router.navigate(['/preferences']).then(() => {
              location.reload(); // Reload the page after navigation to show the navbar
            });
          },
          loginError => {
            console.error('Error logging in user', loginError);
            Swal.fire('Error', 'Login failed: ' + (loginError.error?.message || 'Unknown error'), 'error');
          }
        );
      },
      error => {
        console.error('Error registering user', error);
        Swal.fire('Error', 'Registration failed: ' + (error.error?.message || 'Unknown error'), 'error');
      }
    );
  }

  get passwordStrength() {
    const passwordControl = this.registerForm.get('password');
    return passwordControl && passwordControl.errors ? passwordControl.errors['passwordStrength'] : null;
  }

  get passwordMismatch() {
    return this.registerForm.errors ? this.registerForm.errors['passwordMismatch'] : null;
  }

  get invalidRole() {
    const roleControl = this.registerForm.get('role');
    return roleControl && roleControl.errors ? roleControl.errors['invalidRole'] : null;
  }
}
