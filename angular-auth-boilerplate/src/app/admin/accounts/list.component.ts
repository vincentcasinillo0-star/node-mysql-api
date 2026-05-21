import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { Account } from '@app/_models';

@Component({ 
  templateUrl: 'list.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class ListComponent implements OnInit {
  accounts!: (Account & { isDeleting?: boolean })[];

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.accountService.getAll()
      .pipe(first())
      .subscribe(accounts => this.accounts = accounts);
  }

  deleteAccount(account: Account & { isDeleting?: boolean }) {
    account.isDeleting = true;
    this.accountService.delete(account.id)
      .pipe(first())
      .subscribe(() => {
        this.accounts = this.accounts.filter(x => x.id !== account.id);
      });
  }
}
