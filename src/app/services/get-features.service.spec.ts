import { TestBed } from '@angular/core/testing';

import { GetFeaturesService } from './get-features.service';

describe('GetFeaturesService', () => {
  let service: GetFeaturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetFeaturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
