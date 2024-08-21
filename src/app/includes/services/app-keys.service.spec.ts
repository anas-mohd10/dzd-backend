import { TestBed } from '@angular/core/testing';

import { AppKeysService } from './app-keys.service';

describe('AppKeysService', () => {
  let service: AppKeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppKeysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
