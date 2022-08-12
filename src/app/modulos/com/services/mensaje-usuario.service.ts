import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { MensajeUsuario } from '../entities/mensaje-usuario'

@Injectable()
export class MensajeUsuarioService {

  private subject = new Subject<MensajeUsuario>();

  showMessage(message: MensajeUsuario) {
    this.subject.next(message);
  }

  clearMessage() {
    this.subject.next();
  }
  getMessage(): Observable<MensajeUsuario> {
    return this.subject.asObservable();
  }
}