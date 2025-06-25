import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityEditorComponent } from './availability-editor.component';

describe('AvailabilityEditorComponent', () => {
  let component: AvailabilityEditorComponent;
  let fixture: ComponentFixture<AvailabilityEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailabilityEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailabilityEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
