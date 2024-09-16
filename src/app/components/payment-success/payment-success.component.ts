import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PayPalService } from 'src/app/services/pay-pal.service';
import Swal from 'sweetalert2';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private payPalService: PayPalService,
    private router: Router,
    private analyticsService: AnalyticsService,
    private spinner: NgxSpinnerService 
  ) { }

  ngOnInit(): void {
    this.handlePaymentSuccess();
  } 

  handlePaymentSuccess(): void {
    this.route.queryParams.subscribe(params => {
        const paymentId = params['paymentId'];
        const payerId = params['PayerID'];
        const eventId = params['eventId'];

        if (paymentId && payerId && eventId) {
            this.spinner.show();

            this.payPalService.executeOrder(paymentId, payerId, +eventId).subscribe(
                () => {
                    this.spinner.hide();
                    Swal.fire({
                        title: 'Success!',
                        text: 'Payment successfully executed and ticket deducted.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        this.router.navigate(['/home'], { queryParams: { reload: true } });
                    });
                },
                (error) => {
                    this.spinner.hide();
                    console.error('Error executing payment:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'There was an error executing the payment.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }
            );
        }
    });
}

}
