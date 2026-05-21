import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';

import { AccountService } from '@app/_services';

@Component({ 
  templateUrl: 'details.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class DetailsComponent {
  private accountService = inject(AccountService);
  account$ = this.accountService.account;
}
