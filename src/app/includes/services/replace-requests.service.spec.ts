import { TestBed } from '@angular/core/testing';

import { ReplaceRequestsService } from './replace-requests.service';

describe('ReplaceRequestsService', () => {
  let service: ReplaceRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReplaceRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
