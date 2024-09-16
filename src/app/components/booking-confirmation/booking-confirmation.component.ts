import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  totalAmount: number = 0;

  constructor(public router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      const state = navigation.extras.state as {
        firstName: string;
        lastName: string;
        email: string;
        totalAmount: number;
      };
      this.firstName = state.firstName;
      this.lastName = state.lastName;
      this.email = state.email;
      this.totalAmount = state.totalAmount;
    }
  }

  ngOnInit(): void {}

  confirmPayment(): void {
    // Implement payment logic here
    console.log('Proceeding to payment...');
  }

 
}
