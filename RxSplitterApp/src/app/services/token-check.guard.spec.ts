import { TestBed } from '@angular/core/testing';

import { TokenCheckGuard } from './token-check.guard';

describe('TokenCheckGuard', () => {
  let guard: TokenCheckGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TokenCheckGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
