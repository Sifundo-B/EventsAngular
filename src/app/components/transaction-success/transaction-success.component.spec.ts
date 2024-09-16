import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionSuccessComponent } from './transaction-success.component';

describe('TransactionSuccessComponent', () => {
  let component: TransactionSuccessComponent;
  let fixture: ComponentFixture<TransactionSuccessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransactionSuccessComponent]
    });
    fixture = TestBed.createComponent(TransactionSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
