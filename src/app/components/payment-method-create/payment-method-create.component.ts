import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentMethod } from 'src/app/models/PaymentMethod';
import { PaymentMethodService } from 'src/app/services/payment-method.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment-method-create',
  templateUrl: './payment-method-create.component.html',
  styleUrls: ['./payment-method-create.component.scss']
})
export class PaymentMethodCreateComponent {
  paymentMethod: PaymentMethod = { name: '', description: '' };

  constructor(private paymentMethodService: PaymentMethodService, private router: Router) { }

  createPaymentMethod(): void {
    this.paymentMethodService.createPaymentMethod(this.paymentMethod).subscribe(() => {
      Swal.fire({
        title: 'Success',
        text: 'Payment method has been added successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        this.router.navigate(['/payment-methods']);
      });
    });
  }
}
