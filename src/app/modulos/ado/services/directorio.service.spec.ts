import { TestBed, inject } from '@angular/core/testing';

import { DirectorioService } from './directorio.service';

describe('DirectorioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DirectorioService]
    });
  });

  it('should be created', inject([DirectorioService], (service: DirectorioService) => {
    expect(service).toBeTruthy();
  }));
});
