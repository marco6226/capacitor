
import { ValidationErrors, FormControl, Validators } from '@angular/forms';


export class PasswordValidator implements Validators {

  static REGEXP_DIGITO = /.*\d.*/;
  static REGEXP_MAYUS = /.*[A-Z].*/;
  static REGEXP_MINUS = /.*[a-z].*/;
  static REGEXP_ESPACIO = /.*\s.*/;
  static REGEXP_ESPCHAR = /.*[@#$%^&+=_.].*/;

  static validatePassword(control: FormControl): ValidationErrors {
    if (control.value == null) {
      return { password: 'Campo no puede estar vacio' };
    }
    if (control.value.length < 8) {
      return { password: 'La contraseña debe tener al menos 8 caractéres' };
    }
    if (!control.value.match(PasswordValidator.REGEXP_DIGITO)) {
      return { password: 'La contraseña debe tener al menos un digito numérico' };
    }
    if (!control.value.match(PasswordValidator.REGEXP_MAYUS)) {
      return { password: 'La contraseña debe tener al menos un carácter en mayúscula' };
    }
    if (!control.value.match(PasswordValidator.REGEXP_MINUS)) {
      return { password: 'La contraseña debe tener al menos un carácter en minúscula' };
    }
    if (control.value.match(PasswordValidator.REGEXP_ESPACIO)) {
      return { password: 'La contraseña no puede contener espacios en blanco' };
    }
    if (!control.value.match(PasswordValidator.REGEXP_ESPCHAR)) {
      return { password: 'La contraseña debe tener al menos uno de los siguientes caractéres especiales: @ # $ % ^ & + = _ .' };
    } 
    return null;
  }
}