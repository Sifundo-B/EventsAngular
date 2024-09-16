import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketOptionsComponent } from './ticket-options.component';

describe('TicketOptionsComponent', () => {
  let component: TicketOptionsComponent;
  let fixture: ComponentFixture<TicketOptionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TicketOptionsComponent]
    });
    fixture = TestBed.createComponent(TicketOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
