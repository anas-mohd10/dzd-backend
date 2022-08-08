import { TestBed } from '@angular/core/testing';

import { Invoice.SettingsService } from './invoice.settings.service';

describe('Invoice.SettingsService', () => {
  let service: Invoice.SettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Invoice.SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
