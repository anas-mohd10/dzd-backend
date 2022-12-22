import { TestBed } from '@angular/core/testing';

import { ProductHeadService } from './product.head.service';

describe('Product.HeadService', () => {
  let service: ProductHeadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductHeadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
