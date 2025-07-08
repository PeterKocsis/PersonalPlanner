import { TestBed } from '@angular/core/testing';

import { ActivatedSpaceProviderService } from './activated-space-provider.service';

describe('SpaceProviderService', () => {
  let service: ActivatedSpaceProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivatedSpaceProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
