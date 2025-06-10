import { TestBed } from '@angular/core/testing';

import { TimeRangeAdapterService } from './time-range.adapter.service';

describe('TimeRangeAdapterService', () => {
  let service: TimeRangeAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeRangeAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
