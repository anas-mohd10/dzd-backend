import { TestBed } from '@angular/core/testing';

import { TimeslotsService } from './timeslots.service';

describe('TimeslotsService', () => {
  let service: TimeslotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeslotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
