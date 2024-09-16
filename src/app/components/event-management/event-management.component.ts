import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from 'src/app/services/auth.service';
import { Event } from 'src/app/models/Event';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-management',
  templateUrl: './event-management.component.html',
  styleUrls: ['./event-management.component.scss']
})
export class EventManagementComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  rejectionComment: string = '';
  showRejectionCommentBox: boolean = false;
  selectedEventId: number | undefined;
  searchQuery: string = '';
  suggestions: string[] = [];
  filterStatus: string = 'ALL';
  userId: number | undefined;
  userRole: string[] | null = null;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.authService.getUserId().subscribe(userId => {
      this.userId = userId;
      this.userRole = this.authService.getRole();
      this.loadEvents();
    });
  }
  
  loadEvents(): void {
    this.eventService.getAllEvents().subscribe(events => {
      events = events.map(event => ({
        ...event,
        date: new Date(event.date),
        submissionDate: new Date(event.submissionDate)
      }));
  
      if (this.userRole && this.userRole.includes('Organizer')) {
        this.events = events.filter(event => event.userId === this.userId);
      } else if (this.userRole && this.userRole.includes('Attendee')) {
        this.events = events.filter(event => event.status === 'APPROVED');
      } else {
        this.events = events;
      }
  
      // Sort events by submission date in descending order
      this.events.sort((a, b) => b.submissionDate.getTime() - a.submissionDate.getTime());
  
      this.applyFilter();
    });
  }
  

  applyFilter(): void {
    if (this.filterStatus === 'ALL') {
      this.filteredEvents = [...this.events];
    } else {
      this.filteredEvents = this.events.filter(event => event.status === this.filterStatus);
    }
  }

  approveEvent(id: number | undefined): void {
    if (id !== undefined) {
      this.authService.getUserId().subscribe(userId => {
        if (userId !== undefined) {
          this.eventService.approveEvent(id!, userId).subscribe(() => {
            this.loadEvents();
            Swal.fire({
              title: 'Success!',
              text: 'Event approved successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          });
        }
      });
    }
  }

  showRejectionBox(eventId: number | undefined): void {
    if (eventId !== undefined) {
      this.showRejectionCommentBox = true;
      this.selectedEventId = eventId;
    }
  }

  rejectEvent(): void {
    if (this.selectedEventId !== undefined && this.rejectionComment) {
      this.authService.getUserId().subscribe(userId => {
        if (userId !== undefined) {
          this.eventService.rejectEvent(this.selectedEventId!, userId, this.rejectionComment).subscribe(() => {
            this.loadEvents();
            this.showRejectionCommentBox = false;
            this.rejectionComment = '';
            this.selectedEventId = undefined;
            Swal.fire({
              title: 'Success!',
              text: 'Event rejected successfully.',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          });
        }
      });
    }
  }

  isOrganizerOrAdmin(): boolean {
    return this.authService.isAdmin();
  }

  searchEvents(): void {
    if (this.searchQuery.trim()) {
      this.eventService.searchByName(this.searchQuery).subscribe(eventsByName => {
        if (eventsByName.length > 0) {
          this.filteredEvents = eventsByName;
        } else {
          this.eventService.searchByCategoryName(this.searchQuery).subscribe(eventsByCategory => {
            this.filteredEvents = eventsByCategory;
          });
        }
      });
    } else {
      this.applyFilter();
    }
  }

  getSuggestions(): void {
    if (this.searchQuery.length > 2) {
      this.eventService.autocomplete(this.searchQuery).subscribe(suggestions => {
        this.suggestions = suggestions;
      });
    } else {
      this.suggestions = [];
    }
  }
}
