import { TestBed, inject } from '@angular/core/testing';

import { ListaInspeccionService } from './lista-inspeccion.service';

describe('ListaInspeccionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ListaInspeccionService]
    });
  });

  it('should be created', inject([ListaInspeccionService], (service: ListaInspeccionService) => {
    expect(service).toBeTruthy();
  }));
});
