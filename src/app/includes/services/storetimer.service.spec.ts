import { TestBed } from '@angular/core/testing';

import { StoretimerService } from './storetimer.service';

describe('StoretimerService', () => {
  let service: StoretimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoretimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
