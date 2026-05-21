import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({ 
  templateUrl: 'layout.component.html',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive]
})
export class LayoutComponent { }
