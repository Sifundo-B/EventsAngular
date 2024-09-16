import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedEventsMapComponent } from './approved-events-map.component';

describe('ApprovedEventsMapComponent', () => {
  let component: ApprovedEventsMapComponent;
  let fixture: ComponentFixture<ApprovedEventsMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovedEventsMapComponent]
    });
    fixture = TestBed.createComponent(ApprovedEventsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
