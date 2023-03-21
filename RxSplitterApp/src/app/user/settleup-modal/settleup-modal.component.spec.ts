import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettleupModalComponent } from './settleup-modal.component';

describe('SettleupModalComponent', () => {
  let component: SettleupModalComponent;
  let fixture: ComponentFixture<SettleupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettleupModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettleupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
