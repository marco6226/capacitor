import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { SesionService } from '../services/sesion.service';

@Directive({
  selector: '[sTienePermiso]'
})
export class TienePermisoDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private sesionService: SesionService
  ) { }

  @Input() set sTienePermiso(codigos: string[]) {
    if (this.sesionService.getPermisosMap() == null) {
      return;
    }
    let valido = true
    codigos.forEach(cod => {
      let perm = this.sesionService.getPermisosMap()[cod];
      valido =  valido && (perm != null && perm.valido == true);
    });
    
    if (valido) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}