
import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from 'src/app/services/subscribe.service';
import { SubscriptionPlan } from 'src/app/models/SubscriptionPlans';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { IndividualPlanService } from 'src/app/services/individual-plan.service';

@Component({
  selector: 'app-subscribe-to-individual-plan',
  templateUrl: './subscribe-to-individual-plan.component.html',
  styleUrls: ['./subscribe-to-individual-plan.component.scss']
})
export class SubscribeToIndividualPlanComponent {
  planId: number = 2;  // Initialize with a default value
  successMessage: string = '';  // Initialize with an empty string
  errorMessage: string = ''; 
  selectedPlan: string | null = null;
  individualPlan:any
  constructor(
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private route :ActivatedRoute,
    private individualService:IndividualPlanService
  ) {}

  addUserToIndividualPlan() {
    const userId = this.authService.getCurrentUserId(); // Fetch current user ID from AuthService

    if (this.planId && userId) {
      this.subscriptionService.addUserToIndividualPlan({ planId: this.planId, userId: userId })
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
 
}




