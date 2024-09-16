import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayPalService } from 'src/app/services/pay-pal.service';
import Swal from 'sweetalert2';
import { Event } from 'src/app/models/Event';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  event: Event | null = null;
  ticketType: string | null = null;

  constructor(private payPalService: PayPalService, private router: Router) {}

  ngOnInit(): void {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.event = state['event'];
      this.ticketType = state['ticketType'];
    }
  }

  makePayment(): void {
    if (this.event) {
      this.payPalService.createOrder(this.event.price, this.event.id!).subscribe(
        (response) => {
          window.location.href = response.approvalLink;
        },
        (error) => {
          console.error('PayPal error:', error);
          Swal.fire({
            title: 'Error!',
            text: 'There was an error creating the PayPal order.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }
}
