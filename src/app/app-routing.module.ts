import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CanvasPreferencesComponent } from './components/canvas-preferences/canvas-preferences.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { HomeComponent } from './components/home/home.component';
import { EventMapComponent } from './components/event-map/event-map.component';
import { AuthGuard } from './guards/auth-guards';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { PaymentMethodCreateComponent } from './components/payment-method-create/payment-method-create.component';
import { PaymentMethodListComponent } from './components/payment-method-list/payment-method-list.component';
import { PaymentPalComponent } from './components/payment-pal/payment-pal.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { EditProfilesComponent } from './components/edit-profiles/edit-profiles.component';
import { EventFormComponent } from './event-form/event-form.component';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventManagementComponent } from './components/event-management/event-management.component';
import { ExploreHomeComponent } from './components/explore-home/explore-home.component';
import { MyTicketsPageComponent } from './pages/my-tickets-page/my-tickets-page.component';
import { ViewTicketComponent } from './components/view-ticket/view-ticket.component';
import { BookingConfirmationComponent } from './components/booking-confirmation/booking-confirmation.component';
import { PurchaseTicketComponent } from './components/purchase-ticket/purchase-ticket.component';
import { TransactionSuccessComponent } from './components/transaction-success/transaction-success.component';
import { ErrorComponent } from './components/error/error.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentCancelComponent } from './components/payment-cancel/payment-cancel.component';
import { NotificationComponent } from './components/notification/notification.component';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { PremiumUsersPageComponent } from './pages/premium-users-page/premium-users-page.component';
import { TicketHistoryComponent } from './components/ticket-history/ticket-history.component';
import { FamilyPlanComponent } from './components/family-plan/family-plan.component';
import { SubscribeComponent } from './components/subscribe/subscribe.component';
import { IndividualPlanComponent } from './components/individual-plan/individual-plan.component';
import { SubscriptionPlansComponent } from './components/subscription-plans/subscription-plans.component';
import { UserSubscriptionComponent } from './components/user-subscription/user-subscription.component';
import { UpdateSubscriptionComponent } from './components/update-subscription/update-subscription.component';
import { SubscribeToIndividualPlanComponent } from './components/subscribe-to-individual-plan/subscribe-to-individual-plan.component';
import { ApprovedEventsMapComponent } from './components/approved-events-map/approved-events-map.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { NotAuthorizedComponent } from './components/not-authorized/not-authorized.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MobilePaymentCancelComponent } from './components/mobile-payment-cancel/mobile-payment-cancel.component';
import { MobilePaymentSuccessComponent } from './components/mobile-payment-success/mobile-payment-success.component';


const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'signin', component: LoginComponent  },
  { path: 'signup', component: RegisterComponent},
  { path: 'preferences', component: CanvasPreferencesComponent,canActivate: [AuthGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent,canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard]},
  {path:'map',component:ApprovedEventsMapComponent,canActivate: [AuthGuard]},
  {path:'landing',component:LandingPageComponent},
  { path: 'payment-methods', component: PaymentMethodListComponent,canActivate: [AuthGuard]},
  { path: 'create-payment-method', component: PaymentMethodCreateComponent,canActivate: [AuthGuard] },
  {path:'pay',component:PaymentPalComponent,canActivate: [AuthGuard]},
  { path: 'profile', component: ProfilePageComponent,canActivate:[AuthGuard]},
  { path: 'manage-events', component: EventManagementComponent,canActivate: [AuthGuard]},
  { path: 'payment-success', component: PaymentSuccessComponent,canActivate: [AuthGuard] },
  { path: 'payment-cancel', component: PaymentCancelComponent,canActivate: [AuthGuard] },
  { path: 'mobile-payment-success', component: MobilePaymentSuccessComponent },
  { path: 'mobile-payment-cancel', component: MobilePaymentCancelComponent },
  { path: 'event-details/:id', component: EventDetailsComponent,canActivate: [AuthGuard]},
  { path: 'editProfile/:id', component: EditProfilesComponent,canActivate: [AuthGuard]},
  { path: 'explore', component: ExploreHomeComponent },
  { path: 'create', component: EventFormComponent, canActivate: [AuthGuard], data: { roles: ['Organizer', 'Admin'] } },
  { path: 'myTickets', component: MyTicketsPageComponent,canActivate: [AuthGuard]},
  { path: 'myTickets/:id', component: ViewTicketComponent,canActivate: [AuthGuard]},
  { path: 'purchase-ticket/:id', component: PurchaseTicketComponent,canActivate: [AuthGuard] },
  {path:'transaction',component:TransactionSuccessComponent,canActivate: [AuthGuard]},
  {path:'error',component:ErrorComponent},
  {path:'analytics',component:AnalyticsDashboardComponent,canActivate: [AuthGuard], data: { roles: ['Organizer'] } },
  { path: 'booking-confirmation', component: BookingConfirmationComponent,canActivate: [AuthGuard] },
  { path: 'notification', component: NotificationComponent,canActivate: [AuthGuard] },
  { path: 'premium-package', component: PremiumUsersPageComponent,canActivate: [AuthGuard] },
  { path: 'notification', component: NotificationComponent,canActivate:[AuthGuard]},
  {path:'history',component:TicketHistoryComponent,canActivate: [AuthGuard]},
  { path: 'booking-confirmation', component: BookingConfirmationComponent,canActivate: [AuthGuard] },
  { path: 'family-plan/:id', component: FamilyPlanComponent,canActivate: [AuthGuard] },
  { path: 'subscribe/:userId', component: SubscribeComponent,canActivate: [AuthGuard]},
  { path: 'family-plan', component: FamilyPlanComponent,canActivate: [AuthGuard] },
  { path: 'individual-plan', component: IndividualPlanComponent,canActivate: [AuthGuard]},
  { path: 'subscriptions', component: SubscriptionPlansComponent,canActivate: [AuthGuard]},
  { path: 'subscribe', component: SubscribeComponent,canActivate: [AuthGuard]},
  { path: 'user-subscription', component: UserSubscriptionComponent,canActivate: [AuthGuard]},
{ path: 'update-subscription',component:UpdateSubscriptionComponent,canActivate: [AuthGuard]},
{ path: 'subscribe-individual',component:SubscribeToIndividualPlanComponent,canActivate: [AuthGuard]},
{ path: 'calendar',component:CalendarComponent,canActivate: [AuthGuard]},
{ path: 'not-authorized', component: NotAuthorizedComponent },
{ path: '404', component: NotFoundComponent },  // Add this route
  { path: '**', redirectTo: '/404' }  // Wildcard route for 404 page


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }