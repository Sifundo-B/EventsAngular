import { TestBed } from '@angular/core/testing';

import { GetUserSubscriptionService } from './get-user-subscription.service';

describe('GetUserSubscriptionService', () => {
  let service: GetUserSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetUserSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
