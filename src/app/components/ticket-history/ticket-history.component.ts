import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';  // Import Swal if you want to show details using a popup
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-ticket-history',
  templateUrl: './ticket-history.component.html',
  styleUrls: ['./ticket-history.component.scss']
})
export class TicketHistoryComponent implements OnInit {
  ticketHistory: any[] = [];
  filteredTickets: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchTerm: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}
  private baseUrl = `${environment.apiUrl}/tickets`;

  ngOnInit(): void {
    this.loadTicketHistory();
  }

  loadTicketHistory(): void {
    this.http.get<any[]>(`${this.baseUrl}/history`).subscribe(
      data => {
        this.ticketHistory = data || []; // Ensure ticketHistory is always an array
        this.applyFilter(); // Initialize with filtered data
      },
      error => {
        console.error('Error loading ticket history', error);
        this.ticketHistory = [];
        this.filteredTickets = [];
      }
    );
  }

  applyFilter(): void {
    if (this.searchTerm.trim()) {
      this.filteredTickets = this.ticketHistory.filter(ticket =>
        ticket.eventName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredTickets = [...this.ticketHistory];
    }
    this.currentPage = 1; // Reset to the first page after search
    this.updatePage();
  }

  updatePage(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.filteredTickets = this.filteredTickets.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage * this.itemsPerPage < this.filteredTickets.length) {
      this.currentPage++;
      this.updatePage();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePage();
    }
  }

  downloadTicket(ticketId: number): void {
    const token = this.authService.getToken(); // Use AuthService to get the token
    if (!token) {
      alert('You are not logged in. Please log in and try again.');
      this.authService.logout();  // Optionally redirect to login page
      return;
    }

    this.http.get(`${this.baseUrl}/download/${ticketId}`, {
      responseType: 'text',
      headers: {
        Authorization: `Bearer ${token}` // Include the token in the Authorization header
      }
    }).subscribe(
      (pdfUrl: string) => {
        window.open(pdfUrl, '_blank');
      },
      (error) => {
        if (error.status === 401) {
          console.error('Unauthorized access - please check your login status.');
          alert('Unauthorized access. Please log in and try again.');
        } else if (error.status === 404) {
          console.error('The ticket was not found.');
          alert('Ticket not found. It may have been deleted.');
        } else if (error.status === 500) {
          console.error('Internal server error. Please try again later.');
          alert('An error occurred while processing your request. Please try again later.');
        } else {
          console.error('An unexpected error occurred.', error);
          alert('An unexpected error occurred. Please try again.');
        }
      }
    );
  }

  viewDetails(ticket: any): void {
    Swal.fire({
      title: ticket.eventName,
      html: `
          <p><strong>Date:</strong> ${new Date(ticket.eventDate).toLocaleDateString()}</p>
          <p><strong>Location:</strong> ${ticket.location}</p>
          <p><strong>Ticket Type:</strong> ${ticket.ticketType}</p>
          <p><strong>Attendee:</strong> ${ticket.attendeeName}</p>
          <p><strong>Ticket Number:</strong> ${ticket.ticketNumber}</p>
          `,
      imageUrl: ticket.image,
      imageAlt: 'Event Image',
      showCloseButton: true,
      showConfirmButton: false
    });
  }

  filterTickets(): void {
    this.applyFilter();
  }
}
