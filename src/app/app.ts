import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { DonateModalComponent } from './features/donate-modal.component/donate-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, DonateModalComponent],
  template: `
    <app-donate-modal></app-donate-modal>
    <app-layout></app-layout>
  `,
})
export class App {
  protected readonly title = signal('al-fiqh-london');
}
