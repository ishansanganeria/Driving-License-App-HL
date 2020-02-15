import { TestBed } from '@angular/core/testing';

import { GetStateService } from './get-state.service';

describe('GetStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetStateService = TestBed.get(GetStateService);
    expect(service).toBeTruthy();
  });
});
