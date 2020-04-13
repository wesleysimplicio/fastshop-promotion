import { TestBed } from '@angular/core/testing';

import { JwtIntercerptorService } from './jwt-intercerptor.service';

describe('JwtIntercerptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JwtIntercerptorService = TestBed.get(JwtIntercerptorService);
    expect(service).toBeTruthy();
  });
});
