import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeToIndividualPlanComponent } from './subscribe-to-individual-plan.component';

describe('SubscribeToIndividualPlanComponent', () => {
  let component: SubscribeToIndividualPlanComponent;
  let fixture: ComponentFixture<SubscribeToIndividualPlanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscribeToIndividualPlanComponent]
    });
    fixture = TestBed.createComponent(SubscribeToIndividualPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
