

export class SistemaCausaAdministrativa {
    id: string;
    nombre: string;
    causaAdminList: CausaAdministrativa[];
}

export interface CausaAdministrativa {
    nombre: string;
    causaAdminList: CausaAdministrativa[];
}