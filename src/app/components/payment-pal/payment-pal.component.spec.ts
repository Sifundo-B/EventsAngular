import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPalComponent } from './payment-pal.component';

describe('PaymentPalComponent', () => {
  let component: PaymentPalComponent;
  let fixture: ComponentFixture<PaymentPalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentPalComponent]
    });
    fixture = TestBed.createComponent(PaymentPalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
