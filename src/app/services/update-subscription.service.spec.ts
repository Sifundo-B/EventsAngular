import { TestBed } from '@angular/core/testing';

import { UpdateSubscriptionService } from './update-subscription.service';

describe('UpdateSubscriptionService', () => {
  let service: UpdateSubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateSubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
