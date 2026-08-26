import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryImage {
  url: string;
  caption: string;
  category: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  selectedCategory = signal('All');

  selectedImage = signal<GalleryImage | null>(null);

  categories = ['All', 'Projects', 'Community', 'Events'];

  images: GalleryImage[] = [
    {
      url: '/images/gallery/image.jpg',
      caption: 'Community engagement',
      category: 'Community',
    },    {
      url: '/z2.jpg',
      caption: 'Community engagement',
      category: 'Community',
    },

    {
      url: '/images/gallery/img3.jpg',
      caption: 'Community development project',
      category: 'Projects',
    },

    {
      url: '/img4.png',
      caption: 'Community event',
      category: 'Events',
    },

    {
      url: '/qr6.jpg',
      caption: 'Working with local communities',
      category: 'Community',
    },

    {
      url: '/images/gallery/img4.png',
      caption: 'Project activities',
      category: 'Projects',
    },

    {
      url: '/images/gallery/a1.jpg',
      caption: 'Community gathering',
      category: 'Events',
    },    {
      url: '/z4.jpg',
      caption: 'Community gathering',
      category: 'Events',
    },

    {
      url: '/images/gallery/image.jpg',
      caption: 'Community initiative',
      category: 'Projects',
    },    {
      url: '/y2.jpg',
      caption: 'Community initiative',
      category: 'Projects',
    },

    {
      url: '/q3.webp',
      caption: 'Field activities',
      category: 'Community',
    },
  ];

  filteredImages() {
    const category = this.selectedCategory();

    if (category === 'All') {
      return this.images;
    }

    return this.images.filter((image) => image.category === category);
  }

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }

  openImage(image: GalleryImage): void {
    this.selectedImage.set(image);
    document.body.style.overflow = 'hidden';
  }

  closeImage(): void {
    this.selectedImage.set(null);
    document.body.style.overflow = '';
  }
}
