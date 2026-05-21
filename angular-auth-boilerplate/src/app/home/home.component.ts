import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';

import { AccountService } from '@app/_services';

@Component({ 
  templateUrl: 'home.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent {
  private accountService = inject(AccountService);
  account$ = this.accountService.account;
}
