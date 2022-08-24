import { TestBed } from '@angular/core/testing';

import { Order.ReportService } from './order.report.service';

describe('Order.ReportService', () => {
  let service: Order.ReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Order.ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
