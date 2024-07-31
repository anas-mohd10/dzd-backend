import { TestBed } from '@angular/core/testing';

import { InternationalisationService } from './internationalisation.service';

describe('InternationalisationService', () => {
  let service: InternationalisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternationalisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
