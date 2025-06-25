import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyTimeSlotEditorComponent } from './daily-time-slot-editor.component';

describe('DailyTimeSlotEditorComponent', () => {
  let component: DailyTimeSlotEditorComponent;
  let fixture: ComponentFixture<DailyTimeSlotEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyTimeSlotEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyTimeSlotEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
