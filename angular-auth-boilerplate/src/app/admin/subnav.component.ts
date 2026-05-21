import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({ 
  selector: 'admin-subnav',
  templateUrl: 'subnav.component.html',
  standalone: true,
  imports: [RouterLink, RouterLinkActive]
})
export class SubnavComponent { }
