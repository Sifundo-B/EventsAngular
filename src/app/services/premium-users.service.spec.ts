import { TestBed } from '@angular/core/testing';

import { PremiumUsersService } from './premium-users.service';

describe('PremiumUsersService', () => {
  let service: PremiumUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PremiumUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
