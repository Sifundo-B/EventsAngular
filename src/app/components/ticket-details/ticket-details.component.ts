import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tickets } from 'src/app/models/tickets';
@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss']
})
export class TicketDetailsComponent implements OnInit {
  ticket: Tickets | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state) {
      this.ticket = state['ticket'];
    }
  }
}
