import { TestBed } from '@angular/core/testing';

import { Product.ReportService } from './product.report.service';

describe('Product.ReportService', () => {
  let service: Product.ReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Product.ReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
