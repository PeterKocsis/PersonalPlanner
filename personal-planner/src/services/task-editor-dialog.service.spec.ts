import { TestBed } from '@angular/core/testing';

import { TaskEditorDialogService } from './task-editor-dialog.service';

describe('TaskEditorDialogService', () => {
  let service: TaskEditorDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskEditorDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
