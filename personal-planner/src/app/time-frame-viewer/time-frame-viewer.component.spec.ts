import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeFrameViewerComponent } from './time-frame-viewer.component';

describe('TimeFrameViewerComponent', () => {
  let component: TimeFrameViewerComponent;
  let fixture: ComponentFixture<TimeFrameViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeFrameViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeFrameViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
