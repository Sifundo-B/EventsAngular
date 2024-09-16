import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumUsersPageComponent } from './premium-users-page.component';

describe('PremiumUsersPageComponent', () => {
  let component: PremiumUsersPageComponent;
  let fixture: ComponentFixture<PremiumUsersPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PremiumUsersPageComponent]
    });
    fixture = TestBed.createComponent(PremiumUsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
