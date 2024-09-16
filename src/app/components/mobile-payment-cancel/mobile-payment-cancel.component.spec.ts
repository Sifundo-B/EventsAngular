import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePaymentCancelComponent } from './mobile-payment-cancel.component';

describe('MobilePaymentCancelComponent', () => {
  let component: MobilePaymentCancelComponent;
  let fixture: ComponentFixture<MobilePaymentCancelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobilePaymentCancelComponent]
    });
    fixture = TestBed.createComponent(MobilePaymentCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
