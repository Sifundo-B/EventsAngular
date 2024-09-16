import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilePaymentSuccessComponent } from './mobile-payment-success.component';

describe('MobilePaymentSuccessComponent', () => {
  let component: MobilePaymentSuccessComponent;
  let fixture: ComponentFixture<MobilePaymentSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobilePaymentSuccessComponent]
    });
    fixture = TestBed.createComponent(MobilePaymentSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
