import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({ 
  templateUrl: 'overview.component.html',
  standalone: true,
  imports: [RouterLink, RouterLinkActive]
})
export class OverviewComponent { }
