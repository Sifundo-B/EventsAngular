import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transaction-success',
  templateUrl: './transaction-success.component.html',
  styleUrls: ['./transaction-success.component.scss']
})
export class TransactionSuccessComponent {
  constructor(public router: Router) {}

}
