import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationPickerInputComponent } from './location-picker-input.component';

describe('LocationPickerInputComponent', () => {
  let component: LocationPickerInputComponent;
  let fixture: ComponentFixture<LocationPickerInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationPickerInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPickerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
