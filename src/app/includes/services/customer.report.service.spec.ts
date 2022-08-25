import { TestBed } from '@angular/core/testing';

import { Customer.ReportService } from './customer.report.service';

describe('Customer.ReportService', () => {
  let service: Customer.ReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Customer.ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
