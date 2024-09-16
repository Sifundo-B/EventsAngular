import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetUserSubscriptionService } from 'src/app/services/get-user-subscription.service';
import { SubscriptionPlan } from 'src/app/models/SubscriptionPlans';
import { GetFeaturesService } from 'src/app/services/get-features.service';
import { AuthService } from 'src/app/services/auth.service';
import { SubscriptionService } from 'src/app/services/subscribe.service';

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.scss']
})
export class UserSubscriptionComponent implements OnInit {
  subscriptionPlan: SubscriptionPlan | undefined;
  isLoading: boolean = true; // Initial loading state

  constructor(private getUserSubscriptionService: GetUserSubscriptionService,private authService:AuthService,private subscriptionService:SubscriptionService) { }

  ngOnInit(): void {
    this.getSubscriptionPlan();
  }

  getSubscriptionPlan(): void {
    this.getUserSubscriptionService.getSubscriptionPlan().subscribe(
      (data: SubscriptionPlan) => {
        this.subscriptionPlan = data;
        this.isLoading = false; // Set loading to false after data is received
      },
      (error: any) => {
        console.error('Error fetching subscription plan:', error);
        this.isLoading = false; // Set loading to false on error
      }
    );
  }
  unsubscribe(): void {
    if (this.subscriptionPlan) {
      const userId = this.authService.getCurrentUserId(); // Get the current user's ID
      this.subscriptionService.deleteSubscription().subscribe(
        response => {
          console.log('Unsubscribed successfully:', response);
          // Optionally, you can handle navigation or show a message
          this.subscriptionPlan = undefined;
          alert('you have successfully unsubscribed') // Clear the subscription plan
        },
        error => {
          console.error('Error unsubscribing:', error);
          // Handle the error as needed
        }
      );
    }
  }

}