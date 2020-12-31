import { TestBed } from '@angular/core/testing';

import { AuthenticatedService } from './authenticated.service';

describe('AuthenticatedService', () => {
  let service: AuthenticatedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticatedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
