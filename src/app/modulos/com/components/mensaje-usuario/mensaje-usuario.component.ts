import { Component, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MensajeUsuarioService } from '../../services/mensaje-usuario.service'
import { MensajeUsuario } from '../../entities/mensaje-usuario'

@Component({
  selector: 'sm-mensajeUsuario',
  templateUrl: './mensaje-usuario.component.html',
  styleUrls: ['./mensaje-usuario.component.scss']
})
export class MensajeUsuarioComponent implements OnDestroy {

  subscription: Subscription;
  visible: boolean;
  message: MensajeUsuario
  backingClass: string;
  msg: MensajeUsuario;

  constructor(private mensajeUsuarioService: MensajeUsuarioService) {
    this.subscription = this.mensajeUsuarioService.getMessage().subscribe(message => {
      this.msg = message;
      this.backingClass = "visible";
    });
  }

  hide() {
    this.backingClass = "invisible";
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}