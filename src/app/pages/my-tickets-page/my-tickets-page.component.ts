import { Component, OnInit } from '@angular/core';
import { Tickets } from 'src/app/models/tickets';
import { MyTicketsService } from 'src/app/services/my-tickets.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-tickets-page',
  templateUrl: './my-tickets-page.component.html',
  styleUrls: ['./my-tickets-page.component.scss']
})
export class MyTicketsPageComponent implements OnInit {

  // new object that calls the model which is an array
  tickets: Tickets[] = [];

  // inject the service to call the methods
  constructor(private ticketService: MyTicketsService) {}

  //on initilize the tickets will load
  ngOnInit(): void {
    this.loadTickets();
  }

  //method that will use the service and load the tickets 
  loadTickets(): void {
    this.ticketService.getTicketsByUserId().subscribe(
      (data) => {
        if (Array.isArray(data)) {
          this.tickets = data;
        } else {
          console.error('Expected an array of tickets, but got:', data);
        }
      },
      (error) => {
        console.error('Error fetching tickets:', error);
      }
    );
  }
}
