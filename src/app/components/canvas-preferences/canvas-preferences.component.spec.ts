import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasPreferencesComponent } from './canvas-preferences.component';

describe('CanvasPreferencesComponent', () => {
  let component: CanvasPreferencesComponent;
  let fixture: ComponentFixture<CanvasPreferencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CanvasPreferencesComponent]
    });
    fixture = TestBed.createComponent(CanvasPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
