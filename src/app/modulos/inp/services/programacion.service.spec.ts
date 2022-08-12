import { TestBed, inject } from '@angular/core/testing';

import { ProgramacionService } from './programacion.service';

describe('ProgramacionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProgramacionService]
    });
  });

  it('should be created', inject([ProgramacionService], (service: ProgramacionService) => {
    expect(service).toBeTruthy();
  }));
});
