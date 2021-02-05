import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UtilitiesService } from './utilities.service';

describe('UtilitiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],}));

  it('should be created', () => {
    const service: UtilitiesService = TestBed.get(UtilitiesService);
    expect(service).toBeTruthy();
  });
});
