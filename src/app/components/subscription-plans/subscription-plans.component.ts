import { Component, OnInit } from '@angular/core';
import { SubscriptionPlan } from 'src/app/models/SubscriptionPlans';
import { SubscriptionPlansService } from 'src/app/services/subscription-plans.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss']
})
export class SubscriptionPlansComponent implements OnInit {


  subscriptionPlans: SubscriptionPlan[] = [];

constructor(private subscriptionService: SubscriptionPlansService,private router:Router) { }

  ngOnInit(): void {
    this.subscriptionService.getSubscriptionPlans().subscribe(
      subscriptionPlans => {
      this.subscriptionPlans = subscriptionPlans; 
      },
      error => {
       console.error('Error fetching subscription plans', error);
      }
   
   ) }
   onPlanClick(planName: string): void {
    if (planName === 'Family Plan') {
      this.router.navigate(['/family-plan']);
    } else if (planName === 'Individual Plan') {
      this.router.navigate(['/individual-plan']);
    } else {
      console.error('Unknown plan name');
    }
  }

}