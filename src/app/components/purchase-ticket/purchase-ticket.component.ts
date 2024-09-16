import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/Event';

@Component({
  selector: 'app-purchase-ticket',
  templateUrl: './purchase-ticket.component.html',
  styleUrls: ['./purchase-ticket.component.scss']
})
export class PurchaseTicketComponent implements OnInit {
  event: Event | undefined;
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  ticketType: string = 'Regular';
  price: number = 150;  // Default price

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEvent();
    const user = this.authService.getCurrentUser();
    this.firstName = user!.firstName;
    this.lastName = user!.lastName;
    this.email = user!.email;
  }

  loadEvent(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe(event => {
      this.event = event;
      if (event && event.price) {
        this.price = event.price; // Use event price if available
      }
    });
  }

  confirmBooking(): void {
    // Navigate to booking confirmation with necessary details
    this.router.navigate(['/pay'], {
      state: {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        totalAmount: this.price
      }
    });
  }
}
