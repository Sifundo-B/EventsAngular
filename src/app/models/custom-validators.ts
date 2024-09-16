import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static futureDate(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return { futureDate: true };
    }
    return null;
  }
}
