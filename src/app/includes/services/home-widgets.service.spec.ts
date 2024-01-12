import { TestBed } from '@angular/core/testing';

import { HomeWidgetsService } from './home-widgets.service';

describe('HomeWidgetsService', () => {
  let service: HomeWidgetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeWidgetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
