import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceEditorComponent } from './balance-editor.component';

describe('BalanceEditorComponent', () => {
  let component: BalanceEditorComponent;
  let fixture: ComponentFixture<BalanceEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BalanceEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
