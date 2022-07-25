import { TestBed } from '@angular/core/testing';

import { Logged.InGuard } from './logged.in.guard';

describe('Logged.InGuard', () => {
  let guard: Logged.InGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(Logged.InGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
