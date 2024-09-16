import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/Event';
import { TicketType } from 'src/app/models/TicketType';

@Component({
  selector: 'app-ticket-options',
  templateUrl: './ticket-options.component.html',
  styleUrls: ['./ticket-options.component.scss']
})
export class TicketOptionsComponent implements OnInit {
  event: Event | null = null;
  selectedTicketType: TicketType | null = null;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getEventById(+eventId).subscribe(
        (event) => {
          this.event = event;
        },
        (error) => {
          console.error('Error fetching event details:', error);
        }
      );
    }
  }

  proceedToPayment(): void {
    if (this.event && this.selectedTicketType) {
      this.router.navigate(['/payment'], { state: { event: this.event, ticketType: this.selectedTicketType } });
    }
  }
}
