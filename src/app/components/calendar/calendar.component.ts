import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None // Disable encapsulation to apply styles globally
})
export class CalendarComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  refresh: Subject<any> = new Subject();
  activeDayIsOpen: boolean = false;
  isOrganizer: boolean = false;
  isAttendee: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isOrganizer = this.authService.isOrganizer();
    this.isAttendee = this.authService.isAttendee();
    this.isAdmin = this.authService.isAdmin();
    this.loadEvents();
  }

  private loadEvents(): void {
    this.eventService.getAllEvents().subscribe((events) => {
      const approvedEvents = events.filter(event => event.status === 'APPROVED');
      this.events = approvedEvents.map((event) => ({
        id: event.id!,
        start: new Date(event.date),
        title: event.name,
        color: { 
          primary: event.backgroundColor || '#378006', 
          secondary: '#D1E8FF'
        },
        meta: {
          description: event.description,
          imageUrl: event.imageUrl,
          organizerId: event.userId // Add organizer ID to meta for deletion check
        },
      }));
      this.refresh.next(null);
    });
  }

  handleEventClick(event: CalendarEvent): void {
    if (this.isOrganizer || this.isAttendee || this.isAdmin) {
      Swal.fire({
        title: `${event.title}`,
        text: `What would you like to do with ${event.title}?`,
        imageUrl: event.meta?.imageUrl, // Use the image URL from the event's metadata
        imageAlt: event.title,
        showCancelButton: true,
        confirmButtonText: 'View',
        cancelButtonText: this.isAdmin ? 'Delete' : 'Close', // Show 'Delete' only if the user is an admin
        showCloseButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Navigate to the event details page if "View" is clicked
          this.router.navigate(['/event-details', event.id as number]);
        } else if (result.dismiss === Swal.DismissReason.cancel && this.isAdmin) {
          // Only delete the event if "Delete" is clicked and the user is an admin
          this.deleteEvent(event.id as number, event.meta?.organizerId as number);
        }
      });
    }
  }
  

  deleteEvent(eventId: number, organizerId: number): void {
    if (this.authService.isAdmin()) {
      this.eventService.deleteEvent(eventId).subscribe(
        () => {
          Swal.fire('Deleted!', 'The event has been deleted.', 'success');
          this.loadEvents(); // Refresh the events after deletion
        },
        (error) => Swal.fire('Error', 'Failed to delete event.', 'error')
      );
    } else {
      this.authService.getUserId().subscribe(userId => {
        if (userId === organizerId) {
          this.eventService.deleteEvent(eventId).subscribe(
            () => {
              Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
              this.loadEvents(); // Refresh the events after deletion
            },
            (error) => Swal.fire('Error', 'Failed to delete event.', 'error')
          );
        } else {
          Swal.fire('Unauthorized', 'You are not allowed to delete this event.', 'error');
        }
      });
    }
  }
  

  handleDateClick(arg: any): void {
    if (this.isOrganizer || this.isAdmin) {
      const date = arg.date || arg.dateStr; // Use the actual date or dateStr
      const dateStr = date ? new Date(date).toISOString().split('T')[0] : 'unknown date';
  
      Swal.fire({
        title: 'Create New Event',
        text: `Would you like to create a new event?`,
        showCancelButton: true,
        confirmButtonText: 'Create',
        cancelButtonText: 'Cancel',
        showCloseButton: true,
        icon: 'question',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/create']);
        }
      });
    }
  }
  
  changeView(view: 'year' | 'month' | 'day'): void {
    this.view = view === 'year' ? CalendarView.Week : view === 'day' ? CalendarView.Day : CalendarView.Month;
    this.viewDate = new Date(); // Reset to today's date or modify as needed
  }

  getMonthName(date: Date): string {
    const options = { month: 'long', year: 'numeric' } as const;
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  getDayName(date: Date): string {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } as const;
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  previousMonth(): void {
    const currentMonth = this.viewDate.getMonth();
    const newDate = new Date(this.viewDate.setMonth(currentMonth - 1));
    this.viewDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1); // Set to the first day of the new month
    this.refresh.next(null); // Refresh the calendar view
  }

  nextMonth(): void {
    const currentMonth = this.viewDate.getMonth();
    const newDate = new Date(this.viewDate.setMonth(currentMonth + 1));
    this.viewDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1); // Set to the first day of the new month
    this.refresh.next(null); // Refresh the calendar view
  }
}
