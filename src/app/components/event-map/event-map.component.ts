import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import { Event } from 'src/app/models/Event';

@Component({
  selector: 'app-event-map',
  templateUrl: './event-map.component.html',
  styleUrls: ['./event-map.component.scss']
})
export class EventMapComponent implements OnInit, OnChanges {
  @Input() events: Event[] = [];

  private map!: L.Map;
  private markers: L.Marker[] = [];

  constructor() {}

  ngOnInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events'] && this.events.length > 0) {
      console.log('Received Events:', this.events);
      this.clearMarkers();
      this.addMarkers();
      this.setMapBounds();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [-26.2041, 28.0473], // Coordinates for Johannesburg
      zoom: 12 // Appropriate zoom level for Johannesburg
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private clearMarkers(): void {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
  }

  private addMarkers(): void {
    if (!this.map) return;

    const approvedEvents = this.events.filter(event => event.status === 'APPROVED');
    console.log('Approved Events:', approvedEvents);

    if (approvedEvents.length === 0) {
      console.log('No approved events to display.');
      return;
    }

    approvedEvents.forEach(event => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-icon" style="background-image: url(${event.imageUrl});"></div>`,
        iconSize: [50, 50],
        iconAnchor: [25, 25]
      });

      const marker = L.marker([event.latitude, event.longitude], { icon }).addTo(this.map);
      this.markers.push(marker);

      const popupContent = `
        <b>${event.name}</b><br>
        ${event.description}<br>
        ${new Date(event.date).toLocaleString()}<br>
        ${event.address}<br>
        <img src="${event.imageUrl}" alt="${event.name}" style="width:100px;height:auto;">
      `;

      marker.bindPopup(popupContent);
    });
  }

  private setMapBounds(): void {
    if (!this.map || this.events.length === 0) return;

    const eventLatLngs = this.events.map(event => L.latLng(event.latitude, event.longitude));
    const bounds = L.latLngBounds(eventLatLngs);

    this.map.fitBounds(bounds.pad(0.1)); // padding for markers
  }
}
