import { TestBed } from '@angular/core/testing';

import { Gift.WrapService } from './gift.wrap.service';

describe('Gift.WrapService', () => {
  let service: Gift.WrapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Gift.WrapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
