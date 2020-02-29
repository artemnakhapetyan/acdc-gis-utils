import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcdcGisUtilsComponent } from './acdc-gis-utils.component';

describe('AcdcGisUtilsComponent', () => {
  let component: AcdcGisUtilsComponent;
  let fixture: ComponentFixture<AcdcGisUtilsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcdcGisUtilsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcdcGisUtilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
