import { TestBed, inject } from '@angular/core/testing';

import { AcdcGisUtilsService } from './acdc-gis-utils.service';

describe('AcdcGisUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AcdcGisUtilsService]
    });
  });

  it('should be created', inject([AcdcGisUtilsService], (service: AcdcGisUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
