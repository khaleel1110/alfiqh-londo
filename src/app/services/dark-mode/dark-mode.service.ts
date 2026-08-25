import {Injectable, Signal} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";

export type THEME_TYPE = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class DarkModeService {

  private themeSubject: BehaviorSubject<THEME_TYPE> = new BehaviorSubject<THEME_TYPE>('light');
  theme: Signal<THEME_TYPE> = toSignal(this.themeSubject.asObservable(), {initialValue: 'light'});

  constructor() {
    // Check local storage for a saved theme preference (optional)
    const savedTheme = localStorage.getItem('theme') as THEME_TYPE;
    if (savedTheme) {
      this.themeSubject.next(savedTheme);
      this.applyTheme(savedTheme);
    }
  }

  // Toggle between light and dark modes
  toggleTheme(): void {
    const currentTheme = this.themeSubject.value;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    this.themeSubject.next(newTheme);
    this.applyTheme(newTheme);

    // Save the preference in local storage (optional)
    localStorage.setItem('theme', newTheme);
  }

  // Apply the theme by adding/removing Bootstrap classes
  private applyTheme(theme: THEME_TYPE): void {
    const body = document.body;
    const html = document.documentElement;
    if (theme === 'dark') {
      body.classList.remove('bg-light');
      body.classList.add('bg-dark', 'text-light');
      html.setAttribute('data-bs-theme', 'dark');
    } else {
      body.classList.remove('bg-dark', 'text-light');
      body.classList.add('bg-light');
      html.setAttribute('data-bs-theme', 'light');
    }
  }
}
