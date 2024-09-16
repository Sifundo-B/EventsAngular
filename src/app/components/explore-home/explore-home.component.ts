import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';  // Import Router
import { EventCategory } from 'src/app/models/EventCategory';
import { EventService } from 'src/app/services/event.service';

interface Event {
  id?: number;
  name: string;
  description: string;
  date: Date;
  eventCategory: EventCategory;
  imageUrl: string;
  videoUrl?: string;
  address: string;
  latitude: number;
  longitude: number;
  backgroundColor?: string;  // Add this to store the dominant color
}

@Component({
  selector: 'app-explore-home',
  templateUrl: './explore-home.component.html',
  styleUrls: ['./explore-home.component.scss']
})
export class ExploreHomeComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  additionalEvents: Event[] = [];
  showAll = false;
  selectedCategory: number | null = null;
  categories = [
    { id: 1, name: 'Music' },
    { id: 2, name: 'Sports' },
    { id: 3, name: 'Technology' },
    { id: 4, name: 'Food' },
    { id: 5, name: 'Arts' },
    { id: 6, name: 'Cycling' },
    { id: 7, name: 'Fighting' },
    { id: 9, name: 'Soccer' },
    { id: 10, name: 'Dance' },
    { id: 11, name: 'Sky diving' },
    { id: 12, name: 'Cars' }
  ];

  constructor(private eventService: EventService, private router: Router) {}  // Inject Router

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe(events => {
      this.events = events.map(event => ({
        ...event,
        date: new Date(event.date)
      }));
      this.events.forEach(event => this.calculateDominantColor(event));
      this.events.forEach(event => this.calculateDominantColor(event));
      this.filteredEvents = this.events.slice(0, 4); // Initially show only 4 events
      this.additionalEvents = this.events.slice(4); // Store additional events separately
    });
  }


  filterEventsByCategory(categoryId: number) {
    this.selectedCategory = categoryId;
    this.filteredEvents = this.events.filter(event => event.eventCategory.id === categoryId);
  }

  showAllEvents() {
    this.selectedCategory = null; // Reset category filter
    this.filteredEvents = this.events; // Show all events
    this.selectedCategory = null; // Reset category filter
    this.filteredEvents = this.events; // Show all events
    this.showAll = true;
  }

  hideAdditionalEvents() {
    this.showAll = false;
    this.filteredEvents = this.events.slice(0, 4); // Limit to initial 4 events
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
