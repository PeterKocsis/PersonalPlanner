import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceItemComponent } from './space-item.component';

describe('SpaceItemComponent', () => {
  let component: SpaceItemComponent;
  let fixture: ComponentFixture<SpaceItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
