import { TestBed } from '@angular/core/testing';

import { DeliverySlotsService } from './delivery-slots.service';

describe('DeliverySlotsService', () => {
  let service: DeliverySlotsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliverySlotsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
