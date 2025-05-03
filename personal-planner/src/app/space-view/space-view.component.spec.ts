import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceViewComponent } from './space-view.component';

describe('SpaceTasksComponent', () => {
  let component: SpaceViewComponent;
  let fixture: ComponentFixture<SpaceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SpaceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
