import { Component, OnInit } from '@angular/core';
import { PayPalActions, OrderDetails, PayPalButtonsComponentOptions } from 'src/app/models/paypal.types';
import { Router } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';

declare var paypal: {
  Buttons: (options: PayPalButtonsComponentOptions) => { render: (selector: string) => void };
};

@Component({
  selector: 'app-payment-pal',
  templateUrl: './payment-pal.component.html',
  styleUrls: ['./payment-pal.component.scss']
})
export class PaymentPalComponent implements OnInit {
  constructor(private transactionService: TransactionService, private router: Router) {}

  ngOnInit(): void {
    this.renderPayPalButton();
  }

  renderPayPalButton(): void {
    if (paypal) {
      const options: PayPalButtonsComponentOptions = {
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: '150' // Replace with the amount you want to charge
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details: OrderDetails) => {
            Swal.fire({
              title: 'Success',
              text: 'Transaction completed by ' + details.payer.name.given_name,
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              this.handleTransaction(details);
            });
          });
        },
        onError: (err: Error) => {
          Swal.fire({
            title: 'Error',
            text: 'PayPal Button Error: ' + err.message,
            icon: 'error',
            confirmButtonText: 'OK'
          });
          console.error('PayPal Button Error:', err);
        }
      };

      paypal.Buttons(options).render('#paypal-button-container');
    } else {
      console.error('PayPal SDK not loaded');
    }
  }

  handleTransaction(details: OrderDetails): void {
    const transaction = {
      payerName: `${details.payer.name.given_name} ${details.payer.name.surname}`,
      payerEmail: details.payer.email_address,
      transactionId: details.id,
      paymentMethod: 'PayPal', // Assuming the payment method is PayPal
      amount: parseFloat(details.purchase_units[0].amount.value), // Ensure this is a number
      transactionDate: new Date().toISOString() // Sending the current date in ISO format
    };
  
    this.transactionService.processTransaction(transaction).subscribe(
      response => {
        Swal.fire({
          title: 'Success',
          text: 'Transaction processed successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/transaction']);
        });
      },
      error => {
        Swal.fire({
          title: 'Error',
          text: 'Transaction processing failed: ' + error.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
        console.error('Transaction processing failed:', error);
      }
    );
  }
}
