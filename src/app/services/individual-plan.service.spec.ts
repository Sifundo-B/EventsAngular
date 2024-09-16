import { TestBed } from '@angular/core/testing';

import { IndividualPlanService } from './individual-plan.service';

describe('IndividualPlanService', () => {
  let service: IndividualPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndividualPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
