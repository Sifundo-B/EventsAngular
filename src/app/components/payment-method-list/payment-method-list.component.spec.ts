import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodListComponent } from './payment-method-list.component';

describe('PaymentMethodListComponent', () => {
  let component: PaymentMethodListComponent;
  let fixture: ComponentFixture<PaymentMethodListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentMethodListComponent]
    });
    fixture = TestBed.createComponent(PaymentMethodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
