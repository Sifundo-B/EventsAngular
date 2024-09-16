import { Component, OnInit } from '@angular/core';
import { PaymentMethod } from 'src/app/models/PaymentMethod';
import { PaymentMethodService } from 'src/app/services/payment-method.service';

@Component({
  selector: 'app-payment-method-list',
  templateUrl: './payment-method-list.component.html',
  styleUrls: ['./payment-method-list.component.scss']
})
export class PaymentMethodListComponent implements OnInit{
  paymentMethods: PaymentMethod[] = [];

  constructor(private paymentMethodService: PaymentMethodService) { }

  ngOnInit(): void {
    this.paymentMethodService.getAllPaymentMethods().subscribe(data => {
      this.paymentMethods = data;
    });
  }
}
