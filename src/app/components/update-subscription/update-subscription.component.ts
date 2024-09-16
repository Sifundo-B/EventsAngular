import { Component } from '@angular/core';
import { GetUserSubscriptionService } from 'src/app/services/get-user-subscription.service';
import { SubscriptionPlan } from 'src/app/models/SubscriptionPlans';
import { AuthService } from 'src/app/services/auth.service';
import { SubscriptionPlansService } from 'src/app/services/subscription-plans.service';
import { UpdateSubscriptionService } from 'src/app/services/update-subscription.service';
import { GetFeaturesService } from 'src/app/services/get-features.service';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-update-subscription',
  templateUrl: './update-subscription.component.html',
  styleUrls: ['./update-subscription.component.scss']
})
export class UpdateSubscriptionComponent {
  currentPlan: SubscriptionPlan | undefined;
  subscriptionPlans: SubscriptionPlan[] = []; // All available plans
  newPlanId: number = 0; // ID of the selected plan
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = true;
  message: string | null = null;  // Success message
  error: string | null = null; 

  constructor(
    private getUserSubscriptionService: GetUserSubscriptionService,
    private authService: AuthService,
    private subscriptionPlansService:SubscriptionPlansService,
    private updateSubscriptionService:UpdateSubscriptionService
  ) { }

  ngOnInit(): void {
    this.fetchCurrentSubscriptionPlan();
    this.fetchAllSubscriptionPlans(); // Fetch all plans to let the user choose a new plan
  }
  fetchCurrentSubscriptionPlan(): void {
    this.getUserSubscriptionService.getSubscriptionPlan().subscribe({
      next: (plan: SubscriptionPlan) => {
        this.currentPlan = plan;
        this.newPlanId = plan.id; // Set the current plan's ID as the default selection
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = `Error fetching current subscription plan: ${error.message}`;
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }
  fetchAllSubscriptionPlans(): void {
    this.subscriptionPlansService.getSubscriptionPlans().subscribe({
      next: (plans: SubscriptionPlan[]) => {
        this.subscriptionPlans = plans;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.errorMessage = `Error fetching subscription plans: ${error.message}`;
        this.isLoading = false;
        console.error('Error:', error);
      }
    });
  }

  updatePlan(newPlanId: number) {
    console.log('Updating plan with ID:', newPlanId); // Debugging line
  
    if (isNaN(newPlanId) || newPlanId <= 0) {
      this.error = 'Please enter a valid plan ID.';
      return;
    }
  
    this.updateSubscriptionService.updateSubscriptionPlan(newPlanId).subscribe(
      response => {
        console.log('Subscription updated successfully:', response); // Debugging line
        this.message = 'Subscription updated successfully!';
        this.error = null; // Clear any previous errors
      },
      error => {
        console.error('Error updating subscription:', error); // Debugging line
        this.message = null; // Clear any previous messages
        this.error = 'Failed to update subscription. Please try again later.';
      }
    );
  }
  
}

