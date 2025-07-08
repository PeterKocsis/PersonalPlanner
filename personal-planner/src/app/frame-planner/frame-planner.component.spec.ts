import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FramePlannerComponent } from './frame-planner.component';

describe('FramePlannerComponent', () => {
  let component: FramePlannerComponent;
  let fixture: ComponentFixture<FramePlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FramePlannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FramePlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
