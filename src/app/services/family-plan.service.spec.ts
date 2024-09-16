import { TestBed } from '@angular/core/testing';

import { FamilyPlanService } from './family-plan.service';

describe('FamilyPlanService', () => {
  let service: FamilyPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
