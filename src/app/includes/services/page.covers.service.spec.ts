import { TestBed } from '@angular/core/testing';

import { PageCoversService } from './page.covers.service';

describe('PageCoversService', () => {
  let service: PageCoversService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PageCoversService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
