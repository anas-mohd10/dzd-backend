import { TestBed } from '@angular/core/testing';

import { Banner.ImagesService } from './banner.images.service';

describe('Banner.ImagesService', () => {
  let service: Banner.ImagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Banner.ImagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
