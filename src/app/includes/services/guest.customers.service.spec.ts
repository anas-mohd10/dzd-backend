import { TestBed } from '@angular/core/testing';

import { GuestCustomersService } from './guest.customers.service';

describe('GuestCustomersService', () => {
  let service: GuestCustomersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuestCustomersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
