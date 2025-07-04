import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameBrowserComponent } from './frame-browser.component';

describe('PlannerComponent', () => {
  let component: FrameBrowserComponent;
  let fixture: ComponentFixture<FrameBrowserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrameBrowserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FrameBrowserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
