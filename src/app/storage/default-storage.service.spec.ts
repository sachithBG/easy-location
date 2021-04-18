import { TestBed } from '@angular/core/testing';

import { DefaultStorageService } from './default-storage.service';

describe('DefaultStorageService', () => {
  let service: DefaultStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
