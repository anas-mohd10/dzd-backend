import { TestBed } from '@angular/core/testing';

import { Product.HeadService } from './product.head.service';

describe('Product.HeadService', () => {
  let service: Product.HeadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Product.HeadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
