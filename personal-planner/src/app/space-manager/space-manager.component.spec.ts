import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceManagerComponent } from './space-manager.component';

describe('SpaceManagerComponent', () => {
  let component: SpaceManagerComponent;
  let fixture: ComponentFixture<SpaceManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
