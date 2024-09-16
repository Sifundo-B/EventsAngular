import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepFormSellectorComponent } from './step-form-sellector.component';

describe('StepFormSellectorComponent', () => {
  let component: StepFormSellectorComponent;
  let fixture: ComponentFixture<StepFormSellectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepFormSellectorComponent]
    });
    fixture = TestBed.createComponent(StepFormSellectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
