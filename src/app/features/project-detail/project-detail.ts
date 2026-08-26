import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';



import { ProjectService } from '../../services/project.service';
import { Project, PROJECT_CATEGORIES } from '../projects/project.model';
import { DonationModalService } from '../../services/donation-modal.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.scss',
})
export class ProjectDetailsPage implements OnInit {
  private readonly projectService = inject(ProjectService);
  private readonly route = inject(ActivatedRoute);
  private readonly donationModal = inject(DonationModalService);

openDonate(): void {
  this.donationModal.open();
}


project = signal<Project | null>(null);

  selectedImage = signal('');

  loading = signal(true);
  notFound = signal(false);

  categoryLabel = computed(() => {
    const project = this.project();

    if (!project) {
      return '';
    }

    return (
      PROJECT_CATEGORIES.find((category) => category.key === project.category)?.label ??
      project.category
    );
  });

  progressPercent = computed(() => {
    const project = this.project();

    if (!project || !project.targetAmount || project.raisedAmount === undefined) {
      return 0;
    }

    return Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100));
  });

  gallery = computed(() => {
    const project = this.project();

    if (!project) {
      return [];
    }

    return [project.imageUrl, ...(project.gallery ?? [])];
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');

      if (!slug) {
        this.notFound.set(true);
        this.loading.set(false);
        return;
      }

      const foundProject = this.projectService
        .getProjects()
        .find((project) => project.slug === slug);

      if (!foundProject) {
        this.notFound.set(true);
        this.loading.set(false);
        return;
      }

      this.project.set(foundProject);

      this.selectedImage.set(foundProject.imageUrl);

      this.loading.set(false);
    });
  }

  selectImage(image: string): void {
    this.selectedImage.set(image);
  }

  scrollToDonate(): void {
    document.getElementById('project-support')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
}
