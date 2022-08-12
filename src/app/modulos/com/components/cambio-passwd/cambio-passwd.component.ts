import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UsuarioService } from '../../../emp/services/usuario.service';
import { PasswordValidator } from '../../validators/password-validator';
import { CambioPasswdService } from '../../services/cambio-passwd.service';
import { SesionService } from '../../services/sesion.service';
import { Usuario } from '../../../emp/entities/usuario';

@Component({
  selector: 'sm-cambioPasswd',
  templateUrl: './cambio-passwd.component.html',
  styleUrls: ['./cambio-passwd.component.scss'],
  providers: [UsuarioService]
})
export class CambioPasswdComponent implements OnInit {

  form: FormGroup;
  visible: boolean;
  subscription: Subscription;
  restaurando: boolean = false;

  oldPasswdVisible = false;
  newPasswdVisible = false;
  newPasswdConfirmVisible = false;

  constructor(
    @Inject(FormBuilder) fb: FormBuilder,
    private usuarioService: UsuarioService,
    private cambioPasswdService: CambioPasswdService,
    private sesionService: SesionService,
  ) {
    this.subscription = this.cambioPasswdService.getObservable().subscribe(visible => this.visible = visible);

    this.form = fb.group({
      'oldPasswd': [null, Validators.required],
      'newPasswd': [null, [Validators.required, PasswordValidator.validatePassword]],
      'newPasswdConfirm': [null, Validators.required]
    });
  }

  ngOnInit() {

  }

  onSubmit() {
    this.restaurando = true;
    this.usuarioService.cambiarPasswd(this.form.value.newPasswd, this.form.value.newPasswdConfirm, this.form.value.oldPasswd)
      .then((resp: Usuario) => {
        this.form.reset();
        this.visible = false;
        this.cambioPasswdService.onSubmit(resp);
        this.restaurando = false;
        this.sesionService.setUsuario(resp);
      })
      .catch(err => {
        this.restaurando = false;
      });
  }

  cerrar() {
    this.visible = false;
  }

  toggleOldPasswdVisible(){
    this.oldPasswdVisible = !this.oldPasswdVisible;
  }
  toggleNewPasswdVisible(){
    this.newPasswdVisible = !this.newPasswdVisible;
  }
  toggleNewPasswdConfirmVisible(){
    this.newPasswdConfirmVisible = !this.newPasswdConfirmVisible;
  }

}