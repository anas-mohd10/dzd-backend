import { TestBed } from '@angular/core/testing';

import { Home.SettingsService } from './home.settings.service';

describe('Home.SettingsService', () => {
  let service: Home.SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Home.SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
