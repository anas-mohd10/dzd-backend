import { TestBed } from '@angular/core/testing';

import { ShippingGatwaysService } from './shipping-gatways.service';

describe('ShippingGatwaysService', () => {
  let service: ShippingGatwaysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShippingGatwaysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
