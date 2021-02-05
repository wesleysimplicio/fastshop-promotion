import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { JwtIntercerptorService } from './jwt-intercerptor.service';

describe('JwtIntercerptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],}));

  it('should be created', () => {
    const service: JwtIntercerptorService = TestBed.get(JwtIntercerptorService);
    expect(service).toBeTruthy();
  });
});
