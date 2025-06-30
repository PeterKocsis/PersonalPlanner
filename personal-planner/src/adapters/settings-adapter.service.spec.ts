import { TestBed } from '@angular/core/testing';

import { SettingsAdapterService } from './settings-adapter.service';

describe('SettingsAdapterService', () => {
  let service: SettingsAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
