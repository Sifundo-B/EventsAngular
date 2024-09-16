import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/models/Event';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

// Extend Leaflet's L object with Routing
declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
    class Plan {
      constructor(waypoints: any, options?: any);
    }
  }
}

@Component({
  selector: 'app-approved-events-map',
  templateUrl: './approved-events-map.component.html',
  styleUrls: ['./approved-events-map.component.scss']
})
export class ApprovedEventsMapComponent implements OnInit {
  private map!: L.Map;
  events: Event[] = [];
  private userLocation!: L.LatLng;
  private routingControl: any = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.initMap();
    this.getUserLocation();
    this.loadApprovedEvents();
  }

  private initMap(): void {
    this.map = L.map('map').setView([-26.2041, 28.0473], 12); // Centered on Johannesburg
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userLocation = L.latLng(position.coords.latitude, position.coords.longitude);
        L.marker(this.userLocation).addTo(this.map).bindPopup('You are here').openPopup();
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  private loadApprovedEvents(): void {
    this.eventService.getAllEvents().subscribe(events => {
      this.events = events.filter(event => event.status === 'APPROVED');
      this.addMarkers();
    });
  }

  private addMarkers(): void {
    if (!this.map) return;

    this.events.forEach(event => {
      const icon = L.icon({
        iconUrl: event.imageUrl,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50]
      });

      const marker = L.marker([event.latitude, event.longitude], { icon }).addTo(this.map);

      const popupContent = `
        <b>${event.name}</b><br>
        ${event.description}<br>
        ${new Date(event.date).toLocaleString()}<br>
        ${event.address}<br>
        <img src="${event.imageUrl}" alt="${event.name}" style="width:100px;height:auto;">
        <br><button class="route-btn" onclick="document.dispatchEvent(new CustomEvent('routeToEvent', { detail: { lat: ${event.latitude}, lng: ${event.longitude} } }))">Get Directions</button>
      `;

      marker.bindPopup(popupContent);
    });

    this.setMapBounds();
    this.listenForRouting();
  }

  private setMapBounds(): void {
    if (!this.map || this.events.length === 0) return;

    const eventLatLngs = this.events.map(event => L.latLng(event.latitude, event.longitude));
    const bounds = L.latLngBounds(eventLatLngs);

    this.map.fitBounds(bounds.pad(0.1)); // Padding for better view
  }

  private listenForRouting(): void {
    document.addEventListener('routeToEvent', (e: any) => {
      if (this.userLocation) {
        const eventLocation = L.latLng(e.detail.lat, e.detail.lng);
        
        // Clear previous routing control if it exists
        if (this.routingControl) {
          this.routingControl.getPlan().setWaypoints([]); // Clear waypoints first
          this.map.removeControl(this.routingControl);    // Remove the control
        }

        // Create a custom plan to hide the instruction container
        const plan = new L.Routing.Plan([this.userLocation, eventLocation], {
          createMarker: () => null, // Prevents adding default markers for the waypoints
          addWaypoints: false, // Prevents users from adding new waypoints by dragging
          routeWhileDragging: true,
          geocoder: null, // Disables the geocoder
          showAlternatives: false,
        });

        // Add new routing control without the directions summary
        this.routingControl = L.Routing.control({
          plan: plan,
          lineOptions: {
            styles: [{ color: 'blue', opacity: 0.6, weight: 4 }] // Customize the route line style
          },
          showAlternatives: false, // Do not show alternative routes
          fitSelectedRoutes: true, // Zoom to fit the route
        }).addTo(this.map);
      } else {
        alert('User location is not available.');
      }
    });
  }
}
