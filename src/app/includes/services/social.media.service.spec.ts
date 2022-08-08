import { TestBed } from '@angular/core/testing';

import { Social.MediaService } from './social.media.service';

describe('Social.MediaService', () => {
  let service: Social.MediaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Social.MediaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
