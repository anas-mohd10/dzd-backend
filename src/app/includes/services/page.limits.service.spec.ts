import { TestBed } from '@angular/core/testing';

import { PageLimitsService } from './page.limits.service';

describe('Page.LimitsService', () => {
  let service: PageLimitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageLimitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
