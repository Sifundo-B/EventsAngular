import { NgModule, CUSTOM_ELEMENTS_SCHEMA, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { NgxSpinnerModule } from 'ngx-spinner';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CanvasPreferencesComponent } from './components/canvas-preferences/canvas-preferences.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { EventMapComponent } from './components/event-map/event-map.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PaymentMethodListComponent } from './components/payment-method-list/payment-method-list.component';
import { PaymentMethodDetailComponent } from './components/payment-method-detail/payment-method-detail.component';
import { PaymentMethodCreateComponent } from './components/payment-method-create/payment-method-create.component';
import { PaymentPalComponent } from './components/payment-pal/payment-pal.component';
import { TransactionSuccessComponent } from './components/transaction-success/transaction-success.component';
import { EditProfilesComponent } from './components/edit-profiles/edit-profiles.component';
import { EventManagementComponent } from './components/event-management/event-management.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { ExploreHomeComponent } from './components/explore-home/explore-home.component';
import { MyTicketsPageComponent } from './pages/my-tickets-page/my-tickets-page.component';
import { ViewTicketComponent } from './components/view-ticket/view-ticket.component';
import { PurchaseTicketComponent } from './components/purchase-ticket/purchase-ticket.component';
import { BookingConfirmationComponent } from './components/booking-confirmation/booking-confirmation.component';
import { ErrorComponent } from './components/error/error.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentCancelComponent } from './components/payment-cancel/payment-cancel.component';
import { NotificationComponent } from './components/notification/notification.component';
import { InjectableRxStompConfig, RxStompService, rxStompServiceFactory } from '@stomp/ng2-stompjs';
import { rxStompConfig } from './config/rx-stomp.config';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';

import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { TransactionService } from './services/transaction.service';
import { AnalyticsService } from './services/analytics.service';
import { PremiumUsersPageComponent } from './pages/premium-users-page/premium-users-page.component';
import { TicketDetailsComponent } from './components/ticket-details/ticket-details.component';
import { MyTicketsComponent } from './components/my-tickets/my-tickets.component';
import { TicketOptionsComponent } from './components/ticket-options/ticket-options.component';
import { PaymentComponent } from './components/payment/payment.component';
import { TicketHistoryComponent } from './components/ticket-history/ticket-history.component';
import { SubscriptionPlansComponent } from './components/subscription-plans/subscription-plans.component';
import { FamilyPlanComponent } from './components/family-plan/family-plan.component';
import { IndividualPlanComponent } from './components/individual-plan/individual-plan.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { UserSubscriptionComponent } from './components/user-subscription/user-subscription.component';
import { UpdateSubscriptionComponent } from './components/update-subscription/update-subscription.component';
import { StepFormSellectorComponent } from './components/step-form-sellector/step-form-sellector.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { EventFormComponent } from './event-form/event-form.component';
import { SubscribeToIndividualPlanComponent } from './components/subscribe-to-individual-plan/subscribe-to-individual-plan.component';
import { ApprovedEventsMapComponent } from './components/approved-events-map/approved-events-map.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MobilePaymentSuccessComponent } from './components/mobile-payment-success/mobile-payment-success.component';
import { MobilePaymentCancelComponent } from './components/mobile-payment-cancel/mobile-payment-cancel.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CanvasPreferencesComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    HomeComponent,
    SpinnerComponent,
    EventMapComponent,
    NavbarComponent,
    ToolbarComponent,
    LandingPageComponent,
    PaymentMethodListComponent,
    PaymentMethodDetailComponent,
    PaymentMethodCreateComponent,
    PaymentPalComponent,
    TransactionSuccessComponent,
    EditProfilesComponent,
    ProfilePageComponent,
    MyTicketsPageComponent,
    ViewTicketComponent,
    EventFormComponent,
    EventManagementComponent,
    EventDetailsComponent,
    ExploreHomeComponent,
    PurchaseTicketComponent,
    BookingConfirmationComponent,
    ErrorComponent,
    PaymentSuccessComponent,
    PaymentCancelComponent,
    NotificationComponent,
    AnalyticsDashboardComponent,
    PremiumUsersPageComponent,
    TicketDetailsComponent,
    MyTicketsComponent,
    TicketOptionsComponent,
    PaymentComponent,
    TicketHistoryComponent,
    SubscriptionPlansComponent,
    FamilyPlanComponent,
IndividualPlanComponent,
SubscribeComponent,
UpdateSubscriptionComponent,
UserSubscriptionComponent,
StepFormSellectorComponent,
EventFormComponent,
SubscribeToIndividualPlanComponent,
ApprovedEventsMapComponent,
CalendarComponent,
NotAuthorizedComponent,
NotFoundComponent,
MobilePaymentSuccessComponent,
MobilePaymentCancelComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgxSpinnerModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }) // Add BrowserAnimationsModule here
  ],
  providers: [
    TransactionService,
    AuthService,
    RxStompService,
    { provide: InjectableRxStompConfig, useValue: rxStompConfig },
    AnalyticsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: RxStompService,
      useFactory: rxStompServiceFactory,
      deps: [InjectableRxStompConfig]
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
