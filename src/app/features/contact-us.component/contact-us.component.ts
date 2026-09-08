import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment'; // adjust path to your project

interface ContactApiResponse {
  success: boolean;
  error?: string;
}

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  private http = inject(HttpClient);

  contactReasons = [
    {
      icon: 'bi bi-chat-dots',
      title: 'General Enquiries',
      description:
        'Have a question about Al-Fiqh London or our activities? We would be happy to hear from you.',
    },
    {
      icon: 'bi bi-people',
      title: 'Partnerships',
      description: 'Interested in working with us on an Islamic, educational or community project?',
    },
    {
      icon: 'bi bi-heart',
      title: 'Volunteer With Us',
      description:
        'Join our efforts and contribute your time, skills and experience to meaningful projects.',
    },
    {
      icon: 'bi bi-megaphone',
      title: 'Project Enquiries',
      description:
        'Get in touch to learn more about our current campaigns and community initiatives.',
    },
  ];

  contactInfo = [
    {
      icon: 'bi bi-envelope',
      label: 'Email',
      value: 'info@alfiqhlondon.org',
      href: 'mailto:info@alfiqhlondon.org',
    },
    {
      icon: 'bi bi-telephone',
      label: 'Phone',
      value: '+44 000 000 0000',
      href: 'tel:+440000000000',
    },
    {
      icon: 'bi bi-geo-alt',
      label: 'Location',
      value: 'London, United Kingdom',
      href: null,
    },
  ];

  contact = {
    address: '123 Example Road, London, E1 6AN',
    phone: '+44 20 0000 0000',
    email: 'info@alfiqhlondon.org.uk',
    mapsEmbedUrl: '' as string | SafeResourceUrl,
    social: [
      { label: 'Facebook', url: 'https://facebook.com' },
      { label: 'Instagram', url: 'https://instagram.com' },
      { label: 'WhatsApp', url: 'https://wa.me/' },
    ],
  };

  submitted = false;
  sending = false;
  errorMsg = '';

  form = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  submitForm(): void {
    if (!this.form.name || !this.form.email || !this.form.message) {
      this.errorMsg = 'Please fill in your name, email and message.';
      return;
    }

    this.errorMsg = '';
    this.sending = true;

    this.http
      .post<ContactApiResponse>(environment.contactFunctionUrl, this.form)
      .subscribe({
        next: (res) => {
          this.sending = false;

          if (res.success) {
            this.submitted = true;
            this.form = { name: '', email: '', subject: '', message: '' };
          } else {
            this.errorMsg = res.error || 'Something went wrong. Please try again.';
          }
        },
        error: () => {
          this.sending = false;
          this.errorMsg = 'Something went wrong. Please try again later.';
        },
      });
  }
}
