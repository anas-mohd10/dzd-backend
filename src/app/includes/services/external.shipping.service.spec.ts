import { TestBed } from '@angular/core/testing';

import { ExternalShippingService } from './external.shipping.service';

describe('ExternalShippingService', () => {
  let service: ExternalShippingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalShippingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
