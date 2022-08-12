import { TestBed, inject } from '@angular/core/testing';

import { SistemaNivelRiesgoService } from './sistema-nivel-riesgo.service';

describe('SistemaNivelRiesgoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SistemaNivelRiesgoService]
    });
  });

  it('should be created', inject([SistemaNivelRiesgoService], (service: SistemaNivelRiesgoService) => {
    expect(service).toBeTruthy();
  }));
});
