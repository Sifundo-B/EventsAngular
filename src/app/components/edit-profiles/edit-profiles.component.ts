import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Users } from 'src/app/models/Users'; 
import { UserProfileService } from 'src/app/services/user-profile.service'; 
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http'; // Importing HttpErrorResponse for HTTP error handling
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-edit-profiles',
  templateUrl: './edit-profiles.component.html', // Component's HTML template file
  styleUrls: ['./edit-profiles.component.scss'] // Component's SCSS styles
})
export class EditProfilesComponent implements OnInit {
  userForm: FormGroup; // Form group for user profile form
  user: Users | undefined; // User object from Users model
  editing: boolean = false; // Flag to track if user is in edit mode

  constructor(
    private fb: FormBuilder, // FormBuilder for creating reactive forms
    private userService: UserProfileService, // Service for user profile operations
    private authService: AuthService, // Service for authentication operations
    private userDataService: UserDataService, // Inject the shared service
    private router: Router
  ) {
    // Initialize the userForm FormGroup with form controls and validators
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      address: ['', Validators.required],
      image: [null]
    });
  }

  ngOnInit(): void {
    // Extract user ID from authentication token and fetch user data on component initialization
    const userId = this.authService.extractUserIdFromToken();
    if (userId) {
      this.getUser(userId); // Fetch user data if user ID is available
    } else {
      console.error('No user ID available.'); // Log an error if user ID is not available
    }
  }

  // Method to fetch user data by ID
  getUser(id: number): void {
    this.userService.getUser(id).subscribe(
      (data: Users) => {
        this.user = data; // Assign fetched user data to the component's user property
        // Patch form controls with fetched user data
        this.userForm.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          mobile: data.phoneNumber,
          address: data.address,
          image: data.image
        });
      },
      (error) => {
        console.error('Error fetching user:', error); // Log an error if user data fetching fails
      }
    );
  }

  // Method to handle file selection for profile image upload
  onFileSelected(event: any): void {
    const file: File = event.target.files[0]; // Get the selected file
    if (file) {
      this.userForm.patchValue({ image: file }); // Patch the form with selected file
      const reader = new FileReader();
      reader.onload = () => {
        const img: any = document.getElementById('profile-image1'); // Get image element
        img.src = reader.result as string; // Set image source to uploaded file's data URL
      };
      reader.readAsDataURL(file); // Read uploaded file as data URL
    }
  }

  // Method to trigger file input click for profile image upload
  onProfileImageClick(): void {
    const fileInput: any = document.getElementById('profile-image-upload'); // Get file input element
    fileInput.click(); // Simulate click on file input element
  }


// Method to update user profile
updateProfile(): void {
  // Check if user exists and the form is valid
  if (this.user && this.userForm.valid) {
    const formData = new FormData(); // Create a new FormData object to hold the form data

    // Append user details as a JSON blob to formData
    formData.append('userDetails', new Blob([JSON.stringify({
      firstName: this.userForm.value.firstName, // Add firstName from form value
      lastName: this.userForm.value.lastName,   // Add lastName from form value
      email: this.userForm.value.email,         // Add email from form value
      phoneNumber: this.userForm.value.mobile,  // Add phoneNumber from form value
      address: this.userForm.value.address      // Add address from form value
    })], {
      type: 'application/json' // Set blob type as application/json
    }));

    // Check if an image is selected and append it to formData
    if (this.userForm.value.image) {
      formData.append('image', this.userForm.value.image); // Add image file to formData
    }

    // Call the userService to update the user with formData
    this.userService.updateUser(this.user.id, formData).subscribe(
      (data: Users) => { // On success
        console.log('Updated user data:', data); // Log the updated user data
        this.user = data; // Update the component's user property with the new data
        this.userDataService.updateUser(data); // Update shared user data
        Swal.fire('Success', 'Profile updated successfully', 'success'); // Show success alert
        this.router.navigate(['/profile']); // Navigate to the profile page
      },
      (error: HttpErrorResponse) => { // On error
        console.error('Error updating user:', error); // Log the error
        Swal.fire('Error', 'An error occurred while updating the profile', 'error'); // Show error alert
      }
    );
  } else {
    console.error('Form is not valid or user data is not available.'); // Log an error if form is invalid or user data is unavailable
  }
}

  
  
}
