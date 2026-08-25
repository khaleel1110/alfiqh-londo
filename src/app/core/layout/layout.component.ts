import { Component } from '@angular/core';
import {HeaderComponent} from "../header/header.component";
import {FooterComponent} from "../footer/footer.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet
  ],
  template: `
    <main class="page-wrapper">
   
      <app-header></app-header>
      
      <div style="min-height: 80vh">
      <router-outlet></router-outlet>
      </div>
    </main>
      <app-footer></app-footer>


  `
})
export class LayoutComponent {

}
