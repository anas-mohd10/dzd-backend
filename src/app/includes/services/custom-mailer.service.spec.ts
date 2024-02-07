import { TestBed } from '@angular/core/testing';

import { CustomMailerService } from './custom-mailer.service';

describe('CustomMailerService', () => {
  let service: CustomMailerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomMailerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
