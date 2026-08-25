import {Component, computed, HostListener, inject, signal} from '@angular/core';
import {NavigationEnd, NavigationStart, Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass, NgForOf} from "@angular/common";
import {digitalProduct, service} from "./links";
import {DarkModeService} from "../../services/dark-mode/dark-mode.service";
import {filter} from "rxjs";
import { servicesData } from '../../features/products-and-services/services';
import {projectCaseStudies} from "../../features/digital-products/projects";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLinkActive,
    RouterLink,
    NgForOf,
    NgClass
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
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

  headerThemeMode = computed(() => {
    const darkOnlyRoutes = ['/our-work', '/home', '/digital-solutions', '/crop-prices', '/team', '/partnerships', '/products-and-services',
    '/legal/terms-of-use'];
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


  });
  private checkRoute(url: string) {


    this.currentUrl.set(url);


  }

  themeModeChanged($event: any) {
    console.log($event.data);
    this.themeService.toggleTheme()
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen.set(window.innerWidth < 991);
  }
  constructor() {
this.footerServices = this.processServicesForFooter();
    this.isSmallScreen.set(window.innerWidth < 991);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd || event instanceof NavigationStart),
    ).subscribe((event: any) => {

      if (event instanceof NavigationEnd) {
        this.checkRoute(event.urlAfterRedirects);
      }
      if (event instanceof NavigationStart) {
        this.checkRoute(event.url);
      }
    });
  }
  projects = projectCaseStudies;
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
    footerServices: Array<{name: string, slug: string}> = [];
  
   
    
  
    // Method to create slugs
    getSlug(name: string): string {
      // Replace en dash with hyphen first
      const cleanName = name.replace(/–/g, '-');
  
      return cleanName.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }
  
    // Process servicesData for the footer
    private processServicesForFooter(): Array<{name: string, slug: string}> {
      return servicesData.map(service => {
        // Use the slug from service data if it exists, otherwise generate it
        const slug = service.slug || this.getSlug(service.name);
        return {
          name: service.name,
          slug: slug
        };
      });
    }
}
