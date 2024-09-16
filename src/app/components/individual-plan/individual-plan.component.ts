import { Component, OnInit } from '@angular/core';
import { SubscriptionPlan } from 'src/app/models/SubscriptionPlans';
import { IndividualPlanService } from 'src/app/services/individual-plan.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-individual-plan',
  templateUrl: './individual-plan.component.html',
  styleUrls: ['./individual-plan.component.scss']
})
export class IndividualPlanComponent implements OnInit {
  individualPlan:any

  constructor(private individualPlanService: IndividualPlanService,private router:Router) { }

  ngOnInit(): void {
    this.getIndividualById(2); 
  }

  getIndividualById(id: number): void {
    this.individualPlanService.getIndividualById(id).subscribe(
      data => {
        this.individualPlan = data;
      },
      error => {
        console.error('Error fetching family plan:', error);
      }
    );
}
choosePlan(): void {
  // Pass the plan name as a query parameter
  this.router.navigate(['/subscribe-individual'], {
    queryParams: { plan: 'Individual Plan' }
  });
}

}
