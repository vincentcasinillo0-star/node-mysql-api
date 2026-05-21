import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

import { AccountService } from './_services';
import { AlertComponent } from './_components';
import { Account, Role } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, AlertComponent]
})
export class AppComponent {
  Role = Role;
  account: Account | null = null;

  constructor(private router: Router, private accountService: AccountService) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  logout() {
    this.accountService.logout();
    this.router.navigate(['/account/login']);
  }
}
