import { TestBed } from '@angular/core/testing';

import { PutStateService } from './put-state.service';

describe('PutStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PutStateService = TestBed.get(PutStateService);
    expect(service).toBeTruthy();
  });
});
