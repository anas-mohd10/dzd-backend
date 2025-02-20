import { TestBed } from '@angular/core/testing';

import { MenuNavigationService } from './menu-navigation.service';

describe('MenuNavigationService', () => {
  let service: MenuNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuNavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
