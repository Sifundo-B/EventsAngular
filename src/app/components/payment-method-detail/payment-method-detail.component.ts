import { Component, Input } from '@angular/core';
import { PaymentMethod } from 'src/app/models/PaymentMethod';

@Component({
  selector: 'app-payment-method-detail',
  templateUrl: './payment-method-detail.component.html',
  styleUrls: ['./payment-method-detail.component.scss']
})
export class PaymentMethodDetailComponent {
  @Input() paymentMethod?: PaymentMethod;

  constructor() { }

  ngOnInit(): void { }
}
