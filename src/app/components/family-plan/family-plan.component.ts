import { Component, OnInit } from '@angular/core';
import { SubscriptionPlan } from 'src/app/models/SubscriptionPlans';
import { FamilyPlanService } from 'src/app/services/family-plan.service';

@Component({
  selector: 'app-family-plan',
  templateUrl: './family-plan.component.html',
  styleUrls: ['./family-plan.component.scss']
})
export class FamilyPlanComponent implements OnInit {

  familyPlan:any

  constructor(private familyPlanService: FamilyPlanService) { }

  ngOnInit(): void {
    this.fetchFamilyPlan(1); 
  }

  fetchFamilyPlan(id: number): void {
    this.familyPlanService.getFamilyPlanById(id).subscribe(
      data => {
        this.familyPlan = data;
      },
      error => {
        console.error('Error fetching family plan:', error);
      }
    );
  }

}

