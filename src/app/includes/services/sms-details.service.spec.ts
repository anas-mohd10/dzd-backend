import { TestBed } from '@angular/core/testing';

import { SmsDetailsService } from './sms-details.service';

describe('SmsDetailsService', () => {
  let service: SmsDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmsDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
