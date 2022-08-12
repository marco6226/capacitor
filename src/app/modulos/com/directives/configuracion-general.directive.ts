import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { SesionService } from '../services/sesion.service';

@Directive({
    selector: '[sConfig]'
})
export class ConfiguracionGeneralDirective {

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private sesionService: SesionService
    ) { }

    @Input() set sConfig(codigo: string) {
        if (this.sesionService.getConfiguracionMap() == null) {
            return;
        }
        let config = this.sesionService.getConfiguracionMap()[codigo];
        if (config == null) {
            this.viewContainer.clear();
        } else if (config != null && config.valor == true) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }

}