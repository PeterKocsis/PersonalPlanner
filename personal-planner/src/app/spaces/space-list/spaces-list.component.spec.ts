import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceListComponent } from './spaces-list.component';

describe('SpacesComponent', () => {
  let component: SpaceListComponent;
  let fixture: ComponentFixture<SpaceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
