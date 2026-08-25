import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from './project.service';
import { PROJECT_CATEGORIES, Project, ProjectCategory, ProjectStatus } from './project.model';

type SortOption = 'newest' | 'alphabetical' | 'progress';
type StatusFilter = 'All' | ProjectStatus;

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsPage implements OnInit {
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private allProjects: Project[] = this.projectService.getProjects();

  categories = PROJECT_CATEGORIES;
  statuses: StatusFilter[] = ['All', 'Active', 'Upcoming', 'Ongoing', 'Completed'];
  locations = ['All', ...this.projectService.getLocations()];
  sortOptions: { key: SortOption; label: string }[] = [
    { key: 'newest', label: 'Newest' },
    { key: 'progress', label: 'Most Funded' },
    { key: 'alphabetical', label: 'A–Z' },
  ];

  searchTerm = signal('');
  selectedCategory = signal<ProjectCategory | 'all'>('all');
  selectedStatus = signal<StatusFilter>('All');
  selectedLocation = signal<string>('All');
  featuredOnly = signal(false);
  sortBy = signal<SortOption>('newest');

  filteredProjects = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();
    const status = this.selectedStatus();
    const location = this.selectedLocation();
    const featuredOnly = this.featuredOnly();
    const sort = this.sortBy();

    let list = this.allProjects;

    if (term) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.shortDescription.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term),
      );
    }
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (status !== 'All') list = list.filter((p) => p.status === status);
    if (location !== 'All') list = list.filter((p) => p.location === location);
    if (featuredOnly) list = list.filter((p) => p.featured);

    return [...list].sort((a, b) => {
      switch (sort) {
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'progress':
          return this.progressPercent(b) - this.progressPercent(a);
        default:
          return b.startDate.getTime() - a.startDate.getTime();
      }
    });
  });

  ngOnInit(): void {
    // Supports deep links like /projects?category=zakat from the
    // Home page's "What We Do" cards.
    this.route.queryParamMap.subscribe((params) => {
      const cat = params.get('category') as ProjectCategory | null;
      if (cat && this.categories.some((c) => c.key === cat)) {
        this.selectedCategory.set(cat);
      }
    });
  }

  setCategory(category: ProjectCategory | 'all'): void {
    this.selectedCategory.set(category);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: category === 'all' ? null : category },
      queryParamsHandling: 'merge',
    });
  }

  setStatus(status: StatusFilter): void {
    this.selectedStatus.set(status);
  }

  toggleFeaturedOnly(): void {
    this.featuredOnly.set(!this.featuredOnly());
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.featuredOnly.set(false);
    this.selectedStatus.set('All');
    this.selectedLocation.set('All');
    this.setCategory('all');
  }

  progressPercent(project: Project): number {
    if (!project.targetAmount || !project.raisedAmount) return 0;
    return Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));
  }

  categoryLabel(key: ProjectCategory): string {
    return this.categories.find((c) => c.key === key)?.label ?? key;
  }
}
