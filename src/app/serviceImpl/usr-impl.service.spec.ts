import { TestBed } from '@angular/core/testing';

import { UsrImplService } from './usr-impl.service';

describe('UsrImplService', () => {
  let service: UsrImplService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsrImplService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
