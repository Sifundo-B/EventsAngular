import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../services/event.service';
import { Event } from '../models/Event';
import { EventCategory } from '../models/EventCategory';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomValidators } from '../models/custom-validators';
import * as L from 'leaflet';
import 'leaflet-control-geocoder';
import { debounceTime, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  step: number = 1;
  eventForm: FormGroup;
  selectedImage: File | null = null;
  categories: EventCategory[] = [];
  isAddressValid: boolean = false;
  addressSuggestions: any[] = [];
  today: string;
  addressSelected: boolean = false;
  organizerId: number;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute, // Add this
    private spinner: NgxSpinnerService
  ) {
   // Initialize the form and set initial values
  this.eventForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    date: ['', [Validators.required, CustomValidators.futureDate]],
    eventCategory: ['', Validators.required],
    latitude: [localStorage.getItem('selectedLatitude')],
    longitude: [localStorage.getItem('selectedLongitude')],
    price: [150, Validators.required],
    address: ['', Validators.required],
    numberOfTickets: ['', Validators.required]
  });

  const todayDate = new Date();
  this.today = todayDate.toISOString().split('T')[0];

  this.organizerId = this.authService.extractUserIdFromToken()!;

  // Retrieve date from query parameters if provided
  this.route.queryParams.subscribe(params => {
    if (this.eventForm && params['date']) {
      this.eventForm.get('date')?.setValue(params['date']);
    }
  });
  }

  ngOnInit(): void {
    this.fetchCategories();
    this.eventForm.get('address')?.valueChanges.pipe(
      debounceTime(300),
      switchMap(value => {
        if (value && !this.addressSelected) {
          return this.validateAddress(value);
        } else {
          this.resetAddressFields();
          return of([]);
        }
      })
    ).subscribe();
  }
  get selectedLatitude(): string | null {
    return localStorage.getItem('selectedLatitude');
  }

  get selectedLongitude(): string | null {
    return localStorage.getItem('selectedLongitude');
  }
  fetchCategories() {
    this.eventService.getCategories().subscribe(
      (categories: EventCategory[]) => {
        this.categories = categories;
      },
      (error: any) => {
        console.error('Error fetching categories:', error);
      }
    );
  }
  checkAccess(): void {
    const userRoles = this.authService.getRole(); // Assuming this method returns an array of roles or null
  console.log("Roles " +userRoles);
    if (!userRoles || !userRoles.includes('Organizer')) {
      // Redirect to a different page or show an error message
      this.router.navigate(['/not-authorized']);
      Swal.fire({
        title: 'Access Denied',
        text: 'You do not have permission to create events.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  validateAddress(address: string): Observable<any[]> {
    return new Observable(observer => {
      const geocoder = (L.Control as any).Geocoder.nominatim();
      geocoder.geocode(address, (results: any) => {
        if (results && results.length > 0) {
          console.log('Geocoding Results:', results);
          this.addressSuggestions = results;
          this.isAddressValid = true;
          observer.next(results);
        } else {
          this.resetAddressFields();
          observer.next([]);
        }
        observer.complete();
      });
    });
  }

  selectAddress(suggestion: any) {
    const location = suggestion.center;

    // Save latitude and longitude to localStorage
    localStorage.setItem('selectedLatitude', location.lat);
    localStorage.setItem('selectedLongitude', location.lng);

    // Set latitude and longitude values from localStorage
    this.eventForm.get('latitude')?.setValue(localStorage.getItem('selectedLatitude'));
    this.eventForm.get('longitude')?.setValue(localStorage.getItem('selectedLongitude'));
    this.eventForm.get('address')?.setValue(suggestion.name);

    this.addressSuggestions = [];
    this.addressSelected = true;

    console.log('Selected Latitude:', location.lat);
    console.log('Selected Longitude:', location.lng);
    console.log('Address Selected:', suggestion.name);
  }

  resetAddressFields() {
    this.isAddressValid = false;
    this.eventForm.get('latitude')?.setValue('');
    this.eventForm.get('longitude')?.setValue('');
    this.addressSuggestions = [];
  }

  nextStep() {
    if (this.isStepValid()) {
      this.step++;
    }
  }

  previousStep() {
    if (this.step > 1) {
      this.step--;
    }
  }

  isStepValid(): boolean {
    switch (this.step) {
      case 1:
        return this.eventForm.get('name')?.valid ?? false;
      case 2:
        return (this.eventForm.get('date')?.valid ?? false) && (this.eventForm.get('eventCategory')?.valid ?? false);
      case 3:
        return this.selectedImage !== null;
      case 4:
        return this.eventForm.valid;
      default:
        return true;
    }
  }
  onSubmit() {
    console.log('Form Submission Started');
    
    if (this.selectedLatitude && this.selectedLongitude) {
      this.eventForm.get('latitude')?.setValue(this.selectedLatitude);
      this.eventForm.get('longitude')?.setValue(this.selectedLongitude);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a valid address.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
  
    if (this.eventForm.valid && this.selectedImage) {
      this.loading = true;
      this.spinner.show();
    
      const newEvent: Event = this.eventForm.getRawValue();
      const category = this.categories.find(cat => cat.id === +this.eventForm.value.eventCategory);
      if (category) {
        newEvent.eventCategory = category;
      }
    
      const formData = new FormData();
      formData.append('event', JSON.stringify(newEvent));
      formData.append('image', this.selectedImage);
      formData.append('organizerId', this.organizerId.toString());
    
      this.eventService.createEvent(formData).subscribe(
        (response: any) => {
          console.log('Event created successfully:', response);
          this.resetForm();
    
          localStorage.removeItem('selectedLatitude');
          localStorage.removeItem('selectedLongitude');
    
          Swal.fire({
            title: 'Success!',
            text: 'Event created successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['/manage-events']);
          });
        },
        (error: any) => {
          console.error('Error creating event:', error);
          Swal.fire({
            title: 'Error!',
            text: 'There was an error creating the event.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
          this.spinner.hide();
          this.loading = false;
        }
      );
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Please complete all required fields.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
  
  resetForm() {
    this.eventForm.reset();
    this.addressSelected = false;
    this.spinner.hide();
    this.loading = false;
    this.step = 1;
  }

  onImageSelected(event: any) {
    this.selectedImage = event.target.files[0];
    if (this.selectedImage) {
      Swal.fire({
        title: 'Image Uploaded!',
        text: 'Your image has been successfully uploaded.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    }
  }
}
