import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from 'src/app/models/Users'; 
import { UserProfileService } from 'src/app/services/user-profile.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html', 
  styleUrls: ['./profile-page.component.scss'] 
})

export class ProfilePageComponent implements OnInit {
  isLoggedIn = false; // Flag to track if user is logged in
  user: Users | undefined; // User object from Users model
  errorFetchingUser = false; // Flag to track if there was an error fetching user data
  iduser: any; // Variable to store user ID

  constructor(
    private authService: AuthService, // Authentication service for checking user authentication status
    private router: Router, // Router for navigation within the application
    private userProfileService: UserProfileService // Service for user profile operations
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn(); // Check if user is logged in
    if (this.isLoggedIn) {
      const userId = this.authService.extractUserIdFromToken(); // Extract user ID from authentication token
      this.iduser = userId; // Store user ID for use within the component
      console.log("user id " + userId);
      if (userId !== null) {
        // Fetch user data using userProfileService if user ID is available
        this.userProfileService.getUser(userId).subscribe(
          (data: Users) => {
            this.user = data; // Assign fetched user data to the component's user property
          },
          (error: HttpErrorResponse) => {
            console.error('Error fetching user profile:', error); // Log an error if user data fetching fails
            this.errorFetchingUser = true; // Set error flag to true
          }
        );
      } else {
        console.error('No token available or user not authenticated.');
        this.errorFetchingUser = true; // Log an error if user ID or authentication token is not available
      }
    }
  }

  // Method to logout the user
  logout(): void {
    this.authService.logout(); // Call logout method from authService to clear authentication state
    this.isLoggedIn = false; // Update isLoggedIn flag to false
    this.router.navigate(['/signin']).then(() => {
      window.location.reload(); // Reload the entire application to reflect logged out state
    });  }
}
