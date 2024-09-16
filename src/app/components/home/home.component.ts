import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PreferenceService } from 'src/app/services/preference.service';
import { AuthService } from 'src/app/services/auth.service';
import { Event } from 'src/app/models/Event'; 
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  upcomingMonths: { name: string; coverImage: string; events: Event[] }[] = [];
  selectedCategory: number | null = null;
  savedCategories: { id: number, name: string }[] = [];
  selectedMonth: string | null = null;
  currentMonth: string | null = null;
  showAll = false;
  
  username: string | null = null;
  categories: string[] = [];

  constructor(
    private router: Router, 
    private preferenceService: PreferenceService, 
    private authService: AuthService,
    private userDataService: UserDataService
  ) {}

  ngOnInit() {
    this.loadEvents();
    this.loadUsername();

    this.userDataService.user$.subscribe(user => {
      if (user) {
        this.username = user.firstName;
      }
    });

     // Determine the current month
     const today = new Date();
     const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
     this.currentMonth = monthNames[today.getMonth()];

     this.preferenceService.getPreferences().subscribe(preferences => {
      this.savedCategories = preferences.map((pref: any) => pref.category);
    });
    
  }


  


//method to handle current month events and upcoming events separately
loadEvents() {
  this.preferenceService.getEventsByPreferences().subscribe(events => {
    const today = new Date();
    const currentMonthIndex = today.getMonth();
    const currentYear = today.getFullYear();

    // Filter events for the current month
    this.filteredEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      const eventMonth = eventDate.getMonth();
      const eventYear = eventDate.getFullYear();
      const isUpcoming = eventDate >= today;
      console.log("Events " + this.events);
      return event.status === 'APPROVED' &&
             eventYear === currentYear &&
             eventMonth === currentMonthIndex && // Only include current month events
             isUpcoming;
    });

    // Save a copy of the current month's events for easy reset
    this.events = [...this.filteredEvents];

    // Filter events for upcoming months, excluding the current month
    const upcomingEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      const eventMonth = eventDate.getMonth();
      const eventYear = eventDate.getFullYear();
      const isUpcoming = eventDate >= today;
      
      return event.status === 'APPROVED' &&
             eventYear === currentYear &&
             eventMonth > currentMonthIndex && // Exclude current month
             isUpcoming;
    });

    this.calculateUpcomingMonths(upcomingEvents);
    this.events.forEach(event => this.calculateDominantColor(event));
    console.log("All Events: ", this.events);

  });
}

calculateUpcomingMonths(events: Event[]) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const eventsGroupedByMonth: { [key: string]: Event[] } = {};

  events.forEach(event => {
    const eventDate = new Date(event.date);
    const monthIndex = eventDate.getMonth();
    const monthName = monthNames[monthIndex];

    if (!eventsGroupedByMonth[monthName]) {
      eventsGroupedByMonth[monthName] = [];
    }

    eventsGroupedByMonth[monthName].push(event);
  });

  // Exclude the current month from upcoming months
  this.upcomingMonths = Object.keys(eventsGroupedByMonth)
    .map(monthName => ({
      name: monthName,
      coverImage: '/assets/landing page2..gif', // Update with actual logic for cover images
      events: eventsGroupedByMonth[monthName]
    }))
    .sort((a, b) => monthNames.indexOf(a.name) - monthNames.indexOf(b.name)); // Sort months by their order
}

  
  getEventsForMonth(monthName: string): Event[] {
    const month = this.upcomingMonths.find(m => m.name === monthName);
    return month ? month.events : [];
  }

  

  loadUsername() {
    this.username = this.authService.getUsername();
  }

  //method to filter by category within the current month
  filterEventsByCategory(categoryId: number) {
    if (this.selectedCategory === categoryId) {
      // If the same category is clicked again, reset to all events of the current month
      this.showAllEvents();
    } else {
      this.selectedCategory = categoryId;
      this.filteredEvents = this.events.filter(event => event.eventCategory.id === categoryId);
    }
  }


 //method to show all current month's events
 showAllEvents() { 
  this.selectedCategory = null; // Reset category filter
  this.filteredEvents = [...this.events]; // Show all events
}


  hideAdditionalEvents() {
    this.showAll = false;
    this.filteredEvents = this.events.filter(event => event.eventCategory.id === this.selectedCategory); // Return to filtered view
  }

  selectMonth(monthName: string) {
    this.selectedMonth = monthName;
  }

  calculateDominantColor(event: Event) {
    const img = new Image();
    img.src = event.imageUrl;
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;
      ctx!.drawImage(img, 0, 0);

      const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;
      const length = data.length;

      let r = 0, g = 0, b = 0;

      for (let i = 0; i < length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.floor(r / (length / 4));
      g = Math.floor(g / (length / 4));
      b = Math.floor(b / (length / 4));

      event.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    };
  }

  viewEventDetails(eventId?: number) {
    if (eventId !== undefined) {
      this.router.navigate(['/event-details', eventId]);
    }
  }
}
