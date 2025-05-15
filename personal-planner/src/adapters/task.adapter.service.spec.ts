import { TestBed } from '@angular/core/testing';

import { TaskAdapterService } from './task.adapter.service';

describe('TaskService', () => {
  let service: TaskAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
