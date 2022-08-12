import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { UsuarioService } from '../../../emp/services/usuario.service';
import { CambioPasswdService } from '../../services/cambio-passwd.service';

@Component({
  selector: 'sm-terminosCondiciones',
  templateUrl: 'terminos-condiciones.component.html',
  styleUrls: ['terminos-condiciones.component.scss'],
  providers: [UsuarioService]
})
export class TerminosCondicionesComponent implements OnInit{

  visible: boolean;
  safeHtml: any;
  visibleConfDlg: boolean;
  acepta: boolean;

  loading: boolean;

  constructor(
    public sanitizer: DomSanitizer,
    public authService: AuthService,
    public router: Router,
    public usuarioService: UsuarioService,
    public cambioPasswdService: CambioPasswdService
  ) {
   
  }

  async ngOnInit(){
    this.loading = true;
    await this.authService.consultarPoliticaDatos()
      .then(resp =>{
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(<any>resp['data']);
        this.loading = false;
      })
      .catch(err =>{
        this.loading = false;
      });
    
      try {
        await this.authService.getSubjectTerminos().asObservable()
          .subscribe(visible => {
            this.visible = visible;
        });
      } catch (error) {
        
      }
    
  }

  abrirConfirmacion(acepta: boolean) {
    this.visibleConfDlg = true; 
    this.acepta = acepta;
  }

  marcarAceptacion(acepta: boolean) {
    this.usuarioService.aceptarTerminos(acepta)
    // this.usuarioService.aceptarTerminos(null)
      .then(() => {
        this.visibleConfDlg = false;
        this.visible = false;
        if (acepta == false) {
          this.logout();
        }
      })
      .catch(err => {
        alert("Error al realizar la petición");
        this.visibleConfDlg = false;
        this.visible = false;
      });
  }

  logout() {
    this.authService.logout()
      .then(resp => {
        if (navigator['app'] == null)
          this.router.navigate(['/login']).then(() => location.reload());
        else
          navigator['app'].exitApp();
      })
      .catch(err => alert("Se produjo un error al cerrar sesión"));
  }
}
