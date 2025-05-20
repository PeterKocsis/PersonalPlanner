import { TestBed } from '@angular/core/testing';

import { TimeFrameAdapterService } from './time-frame.adapter.service';

describe('TimeFrameAdapterService', () => {
  let service: TimeFrameAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeFrameAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
