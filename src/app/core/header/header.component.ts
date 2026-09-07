import { Component, computed, ElementRef, HostListener, inject, signal } from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { NgClass, NgForOf } from '@angular/common';
import { digitalProduct, service } from './links';
import { DarkModeService } from '../../services/dark-mode/dark-mode.service';
import { filter } from 'rxjs';
import { DonationModalService } from '../../services/donation-modal.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, NgForOf, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    private donationModal: DonationModalService,
    private elementRef: ElementRef<HTMLElement>,
  ) {
    /*this.footerServices = this.processServicesForFooter();*/
    this.isSmallScreen.set(window.innerWidth < 991);
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd || event instanceof NavigationStart))
      .subscribe((event: any) => {
        if (event instanceof NavigationEnd) {
          this.checkRoute(event.urlAfterRedirects);
        }
        if (event instanceof NavigationStart) {
          this.checkRoute(event.url);
          // Any navigation (including clicking a nav link) should close
          // the mobile menu and any open dropdown, since we no longer
          // rely on Bootstrap's JS plugins to do this for us.
          this.isMenuOpen.set(false);
          this.openDropdown.set(null);
        }
      });
  }

  openDonate(): void {
    this.donationModal.open();
  }

  menuItems = [
    { label: 'About', link: '/our-work' },
    { label: 'Team', link: '/team' },
    { label: 'Career', link: '/career' },
    { label: 'Partnerships', link: '/partnerships' },

    { label: 'Contact us', link: '/contact-us' },
    { label: 'News', link: '/news-and-activities' },
  ];
  router = inject(Router);
  protected readonly digitalProduct = digitalProduct;
  themeService = inject(DarkModeService);
  isScrolled = signal(false);
  currentUrl = signal('');
  isSmallScreen = signal(false);

  // ---------- Mobile menu ----------
  // Driven entirely by Angular rather than Bootstrap's JS collapse
  // plugin, so it works even if bootstrap.bundle.js isn't loaded/wired
  // up. The `.collapse` / `.collapse.show` CSS from Bootstrap still
  // applies — we just toggle the `show` class ourselves.
  isMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMenuOpen.set(false);
  }

  // ---------- Nav dropdowns ("Our Work", "Get to Know") ----------
  // Same problem as the collapse menu: `data-bs-toggle="dropdown"` needs
  // Bootstrap's JS to be loaded and initialised, which isn't reliable
  // here (and doesn't work at all inside the mobile collapse panel).
  // We drive this with a signal instead and reuse Bootstrap's existing
  // `.dropdown-menu` / `.dropdown-menu.show` CSS for the actual styling.
  openDropdown = signal<string | null>(null);

  isDropdownOpen(name: string): boolean {
    return this.openDropdown() === name;
  }

  toggleDropdown(name: string, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.openDropdown.update((current) => (current === name ? null : name));
  }

  closeDropdowns(): void {
    this.openDropdown.set(null);
  }

  // Close any open dropdown when the user clicks outside the header
  // (the toggle buttons themselves stop propagation, so this only
  // fires for genuine outside/other clicks).
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeDropdowns();
    }
  }

  headerThemeMode = computed(() => {
    const darkOnlyRoutes = [
      '/our-work',
      '/home',
      '/digital-solutions',
      '/crop-prices',
      '/team',
      '/partnerships',
      '/products-and-services',
      '/legal/terms-of-use',
    ];
    const lightOnlyRoutes = ['/', '', '/studio/partnership'];
    const url = this.currentUrl();

    if (this.isScrolled()) {
      return this.themeService.theme();
    } else {
      if (darkOnlyRoutes.includes(url)) {
        return 'dark';
        //dark mode
      } else if (lightOnlyRoutes.includes(url)) {
        //light mode forced
        return 'light';
      } else {
        //default
        return this.themeService.theme();
      }
    }
  });
  private checkRoute(url: string) {
    this.currentUrl.set(url);
  }

  themeModeChanged($event: any) {
    console.log($event.data);
    this.themeService.toggleTheme();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen.set(window.innerWidth < 991);
    // If the viewport grows back to desktop width, make sure the mobile
    // menu doesn't stay stuck open underneath the now-visible desktop nav.
    if (window.innerWidth >= 992) {
      this.isMenuOpen.set(false);
      this.openDropdown.set(null);
    }
  }

  /*  projects = projectCaseStudies;*/
  /*  headerThemeMode = computed(() => {
      const darkOnlyRoutes = ['/studio/about-us', '/studio/team', '/services', '/studio/projects'];
      const lightOnlyRoutes = ['/', '', '/studio/partnership',];
      const url = this.currentUrl();

      if (this.isScrolled()) {
        return this.themeService.theme();
      } else {
        if (darkOnlyRoutes.includes(url)) {
          return 'dark';
          //dark mode
        } else if (lightOnlyRoutes.includes(url)) {
          //light mode forced
          return 'light';
        } else {
          //default
          return this.themeService.theme();
        }
      }


    });*/

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Check if page is scrolled more than 50px
    if (window.scrollY > 50) {
      this.isScrolled.set(true);
    } else {
      this.isScrolled.set(false);
    }
  }

  protected readonly service = service;

  // Create a processed version of servicesData with slugs
  footerServices: Array<{ name: string; slug: string }> = [];

  // Method to create slugs
  getSlug(name: string): string {
    // Replace en dash with hyphen first
    const cleanName = name.replace(/–/g, '-');

    return cleanName
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  // Process servicesData for the footer
  /*    private processServicesForFooter(): Array<{name: string, slug: string}> {
      return servicesData.map(service => {
        // Use the slug from service data if it exists, otherwise generate it
        const slug = service.slug || this.getSlug(service.name);
        return {
          name: service.name,
          slug: slug
        };
      });
    }*/
}
