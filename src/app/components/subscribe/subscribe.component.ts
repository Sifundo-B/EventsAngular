import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from 'src/app/services/subscribe.service';
import { SubscriptionPlan } from 'src/app/models/SubscriptionPlans';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { IndividualPlanService } from 'src/app/services/individual-plan.service';
@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.scss']
})
export class SubscribeComponent  {
  planId: number = 1;  // Initialize with a default value
  successMessage: string = '';  // Initialize with an empty string
  errorMessage: string = ''; 
  selectedPlan: string | null = null;
  individualPlan:any
  subscriptionPlan: SubscriptionPlan | undefined;
  constructor(
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private route :ActivatedRoute,
    private individualService:IndividualPlanService
  ) {}

  addUserToFamilyPlan() {
    const userId = this.authService.getCurrentUserId(); // Fetch current user ID from AuthService

    if (this.planId && userId) {
      this.subscriptionService.addUserToFamilyPlan({ planId: this.planId, userId: userId })
        .subscribe({
          next: (response) => {
            this.successMessage = `User added to plan successfully.`;
            console.log('Response:', response);
          },
          error: (error) => {
            this.errorMessage = `An error occurred: ${error.message}`;
            console.error('Error:', error);
          }
        });
    } else {
      this.errorMessage = 'Please select a valid plan and ensure you are logged in.';
    }
  }
  unsubscribe(): void {
    if (this.subscriptionPlan) {
      const userId = this.authService.getCurrentUserId(); // Get the current user's ID
      this.subscriptionService.deleteSubscription().subscribe(
        response => {
          console.log('Unsubscribed successfully:', response);
          this.subscriptionPlan = undefined;
          this.successMessage = 'You have successfully unsubscribed'; // Set the success message
          setTimeout(() => this.successMessage = '', 5000); // Clear the message after 5 seconds
        },
        error => {
          console.error('Error unsubscribing:', error);
          this.errorMessage = 'An error occurred while unsubscribing'; // Set the error message
        }
      );
    }
  }
  }
 


