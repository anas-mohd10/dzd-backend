import { TestBed } from '@angular/core/testing';

import { MegamenuService } from './megamenu.service';

describe('MegamenuService', () => {
  let service: MegamenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MegamenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
