import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { AuthService } from 'src/app/services/auth.service';
import { PayPalService } from 'src/app/services/pay-pal.service';
import { Event } from 'src/app/models/Event';
import { DeviceService } from 'src/app/services/device.service'; // Import DeviceService
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit, AfterViewChecked {
  event: Event | undefined;
  private map: L.Map | undefined;
  private mapInitialized = false;
  rejectionComment: string = '';
  showRejectionCommentBox: boolean = false;
  organizerId: number | undefined; 
  backgroundColorStyle: string | undefined;
  loading: boolean = false;
  private userLocation!: L.LatLng;
  private routingControl: any = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private payPalService: PayPalService,    
    private deviceService: DeviceService,  // Inject DeviceService
    private spinner: NgxSpinnerService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvent();
    this.loadOrganizerId(); 
  }

  ngAfterViewChecked(): void {
    if (this.event && !this.mapInitialized) {
      this.initMap();
      this.mapInitialized = true;
    }
  }

  loadEvent(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventService.getEventById(id).subscribe(event => {
      this.event = event;
      if (this.event?.imageUrl) {
        this.extractAndApplyThemeColor(this.event.imageUrl);
      }
      if (this.map) {
        this.map.remove();
        this.mapInitialized = false; // Allow re-initialization of the map
      }
    });
  }

  loadOrganizerId(): void {
    this.authService.getUserId().subscribe(id => {
      this.organizerId = id;
    });
  }

  initMap(): void {
    if (this.event) {
      this.map = L.map('map').setView([this.event.latitude, this.event.longitude], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      const customIcon = L.icon({
        iconUrl: this.event.imageUrl,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50]
      });

      L.marker([this.event.latitude, this.event.longitude], { icon: customIcon }).addTo(this.map)
        .bindPopup(this.event.address)
        .openPopup();

      this.getUserLocationAndRoute();
    }
  }

  getUserLocationAndRoute(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.userLocation = L.latLng(position.coords.latitude, position.coords.longitude);
  
        if (this.map) {
          L.marker(this.userLocation).addTo(this.map).bindPopup('You are here').openPopup();
  
          if (this.event) {
            const eventLocation = L.latLng(this.event.latitude, this.event.longitude);
  
            if (this.routingControl) {
              this.routingControl.getPlan().setWaypoints([]); // Clear waypoints first
              this.map.removeControl(this.routingControl);    // Remove the control
            }
  
            this.routingControl = L.Routing.control({
              waypoints: [this.userLocation, eventLocation],
              routeWhileDragging: true,
              lineOptions: {
                styles: [{ color: 'blue', opacity: 0.6, weight: 4 }]
              },
              showAlternatives: false,
            }).addTo(this.map);
          }
        }
      }, () => {
        // alert('Could not get your location.');
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
  
  extractAndApplyThemeColor(imageUrl: string): void {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const rgb = this.getAverageColor(imageData.data);
        this.applyTheme(rgb);
      }
    };
  }

  getAverageColor(data: Uint8ClampedArray): [number, number, number] {
    let r = 0, g = 0, b = 0;
    const length = data.length;

    for (let i = 0; i < length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }

    r = Math.floor(r / (length / 4));
    g = Math.floor(g / (length / 4));
    b = Math.floor(b / (length / 4));

    return [r, g, b];
  }

  applyTheme([r, g, b]: [number, number, number]): void {
    this.backgroundColorStyle = `linear-gradient(rgb(${r}, ${g}, ${b}), rgb(26, 26, 26))`;
  }

  approveEvent(): void {
    if (this.event && this.event.id !== undefined && this.organizerId !== undefined) { 
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to approve this event?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, approve it!',
        cancelButtonText: 'No, cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.eventService.approveEvent(this.event!.id!, this.organizerId!).subscribe(() => {
            this.loadEvent();
            Swal.fire(
              'Approved!',
              'The event has been approved successfully.',
              'success'
            );
          });
        }
      });
    }
  }
    
  rejectEvent(): void {
    if (this.event && this.event.id !== undefined && this.organizerId !== undefined) { 
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to reject this event?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, reject it!',
        cancelButtonText: 'No, cancel',
        input: 'textarea',
        inputPlaceholder: 'Enter rejection comment...',
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!';
          }
          return null; // This satisfies the inputValidator type
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.rejectionComment = result.value!;
          this.eventService.rejectEvent(this.event!.id!, this.organizerId!, this.rejectionComment).subscribe(() => {
            this.loadEvent();
            Swal.fire(
              'Rejected!',
              'The event has been rejected successfully.',
              'success'
            );
          });
        }
        return; // Explicit return added here to satisfy TypeScript
      });
    }
    return; // Explicit return added here to cover cases where the if condition is false
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  isAttendee(): boolean {
    return this.authService.isAttendee() || this.authService.isOrganizer();
  }

  navigateBasedOnRole(): void {
    if (this.authService.isAttendee()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  purchaseTicket(): void {
    if (this.event && this.event.id && this.organizerId !== undefined) {
      console.log("Userid " + this.event.userId);
      console.log("OrganizerId " + this.organizerId);
  
      if (this.event.userId === this.organizerId) {
        Swal.fire({
          title: 'Error!',
          text: 'You cannot purchase tickets for your own event.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        return;
      }
  
      const amount = this.event.price;
      const eventId = this.event.id;
  
      this.loading = true;  // Show loader
  
      this.payPalService.createOrder(amount, eventId).subscribe(
        (response) => {
          this.loading = false;  // Hide loader before redirecting
  
          // For both mobile and non-mobile, we can force the PayPal page to open within the Breeze app context.
          // We'll do this by using '_self' for mobile and '_blank' for non-mobile, but with additional considerations.
          if (this.deviceService.isMobile() || window.innerWidth <= 768) {
            // For mobile devices or small screen emulation, open in the same tab
            window.open(response.approvalLink, '_self');
          } else {
            // For larger screens (likely non-mobile), open in an iframe or preserve the Breeze layout
            const newWindow = window.open('', '_self', 'width=600,height=800');
            if (newWindow) {
              newWindow.location.href = response.approvalLink;
            } else {
              // Fallback if pop-up is blocked
              Swal.fire({
                title: 'Error!',
                text: 'Popup blocked. Please allow popups and try again.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          }
        },
        (error) => {
          this.loading = false;  // Hide loader on error
          console.error('PayPal error:', error);
          Swal.fire({
            title: 'Error!',
            text: 'There was an error creating the PayPal order.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }
  
  
  
  downloadTicket(eventId: number): void {
    this.eventService.downloadTicket(eventId).subscribe(ticketUrl => {
      const link = document.createElement('a');
      link.href = ticketUrl; // Use the Cloudinary URL to download the PDF
      link.target = '_blank'; // Open in a new tab
      link.rel = 'noopener noreferrer'; // Security best practice
      link.click();
  
      // Optionally, you can still navigate to manage events after the ticket is opened
      // this.router.navigate(['/manage-events']);
    });
  }
}
