import { TestBed } from '@angular/core/testing';

import { ProductDesignsService } from './product.designs.service';

describe('ProductDesignsService', () => {
  let service: ProductDesignsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductDesignsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
