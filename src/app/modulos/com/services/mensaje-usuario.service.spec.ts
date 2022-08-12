import { TestBed, inject } from '@angular/core/testing';

import { MensajeUsuarioService } from './mensaje-usuario.service';

describe('MensajeUsuarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MensajeUsuarioService]
    });
  });

  it('should be created', inject([MensajeUsuarioService], (service: MensajeUsuarioService) => {
    expect(service).toBeTruthy();
  }));
});
