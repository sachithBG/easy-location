import { TestBed } from '@angular/core/testing';

import { LocImpService } from './loc-imp.service';

describe('LocImpService', () => {
  let service: LocImpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocImpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
