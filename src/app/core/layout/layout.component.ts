import { Component } from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {RouterOutlet} from "@angular/router";
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, Footer],
  template: `
    <main class="page-wrapper">
      <app-header></app-header>

      <div style="min-height: 80vh">
        <router-outlet></router-outlet>
      </div>
    </main>
    <app-footer></app-footer>
  `,
})
export class LayoutComponent {}
