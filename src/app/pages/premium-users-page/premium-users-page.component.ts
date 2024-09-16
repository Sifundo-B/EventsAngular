import { Component, OnInit } from '@angular/core';
import { Users } from 'src/app/models/Users';
import { AuthService } from 'src/app/services/auth.service';
import { PremiumUsersService } from 'src/app/services/premium-users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-premium-users-page',
  templateUrl: './premium-users-page.component.html',
  styleUrls: ['./premium-users-page.component.scss']
})
export class PremiumUsersPageComponent implements OnInit {
  premiumUsers: Users[] = [];
  filteredUsers: Users[] = [];
  packageTypes: string[] = ['Individual', 'Family Plan']; // Add your package types here
  searchTerm: string = '';
  selectedPackageType: string = '';
  sortOrder: string = 'asc';

  constructor(private premiumService: PremiumUsersService ) { }

  ngOnInit(): void {
    this.getPremiumUsers();
  }

  applyFilters(): void {
    let users = [...this.premiumUsers];

    // Filter by search term
    if (this.searchTerm) {
      users = users.filter(user => user.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
    }

    // Filter by package type
    if (this.selectedPackageType) {
      users = users.filter(user => user.packageType === this.selectedPackageType);
    }

    // Sort by name
    if (this.sortOrder === 'asc') {
      users = users.sort((a, b) => a.firstName.localeCompare(b.firstName));
    } else if (this.sortOrder === 'desc') {
      users = users.sort((a, b) => b.lastName.localeCompare(a.lastName));
    }

    this.filteredUsers = users;
  }

  getPremiumUsers(): void {
    this.premiumService.getAllPremiumUsers().subscribe(
      // users => this.premiumUsers = users,
      users => {
        this.premiumUsers = users;
        this.applyFilters(); // Apply initial filters
      },
      error => {
        console.error('Error fetching premium users', error);
        Swal.fire('Error', 'Failed to fetch premium users', 'error');
      }
    );
  }

  upgradeUserToPremium(userId: number, packageType: string): void {
    this.premiumService.upgradeUserToPremium(userId, packageType).subscribe(
      response => {
        Swal.fire('Success', response, 'success');
        this.getPremiumUsers(); // Refresh the list after upgrading
      },
      error => {
        console.error('Error upgrading user to premium', error);
        Swal.fire('Error', 'Failed to upgrade user to premium', 'error');
      }
    );
  }

  downgradeUserFromPremium(userId: number): void {
    this.premiumService.downgradeUserFromPremium(userId).subscribe(
      response => {
        Swal.fire('Success', response, 'success');
        this.getPremiumUsers(); // Refresh the list after downgrading
      },
      error => {
        console.error('Error downgrading user from premium', error);
        Swal.fire('Error', 'Failed to downgrade user from premium', 'error');
      }
    );
  }

  updateUserSubscriptionStatus(userId: number, isPremium: boolean, packageType: string): void {
    this.premiumService.updateUserSubscriptionStatus(userId, isPremium, packageType).subscribe(
      () => {
        this.getPremiumUsers();
        Swal.fire('Success', 'Subscription status updated successfully', 'success');
      },
      error => {
        console.error('Error updating subscription status', error);
        Swal.fire('Error', error.message, 'error');
      }
    );
  }

  manageUserAccess(userId: number, grantAccess: boolean): void {
    this.premiumService.manageUserAccess(userId, grantAccess).subscribe(
      response => {
        Swal.fire('Success', response, 'success');
        this.getPremiumUsers(); // Refresh the list after managing access
      },
      error => {
        console.error('Error managing user access', error);
        Swal.fire('Error', 'Failed to manage user access', 'error');
      }
    );
  }

}


