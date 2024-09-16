import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Tickets } from 'src/app/models/tickets';
import { MyTicketsService } from 'src/app/services/my-tickets.service';

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.scss']
})
export class ViewTicketComponent {

  tickets: any; // Define ticket object
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: MyTicketsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const ticketId = +params['id']; // Extract ticket ID from route parameters
      this.fetchTicket(ticketId); // Call method to fetch ticket details
    });
  }

  fetchTicket(ticketId: number): void {
    this.ticketService.getTicketById(ticketId).subscribe(
      (ticket) => {
        this.tickets = ticket; // Assign fetched ticket details to component variable
      },
      (error) => {
        console.error('Error fetching ticket:', error);
        // Handle error (e.g., display error message to user)
      }
    );
  }

  goBack(): void {
    this.router.navigate(['/myTickets']); // Navigate back to my-tickets page
  }
}
