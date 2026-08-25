import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  DonationModalService,
  DonationPurpose,
} from './donation-modal.service';
import { DonationService } from './donation.service';

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

@Component({
  selector: 'app-donate-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './donate-modal.component.html',
  styleUrl: './donate-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonateModalComponent {
  readonly modal = inject(DonationModalService);
  private readonly donationService = inject(DonationService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly purposes: DonationPurpose[] = [
    'General Donation',
    'Zakat',
    'Sadaqah',
    'Orphans',
    'Food Distribution',
    'Education',
  ];

  readonly currencies: Currency[] = [
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
  ];

  readonly quickAmounts = [5000, 10000, 25000, 50000];

  loading = false;
  errorMessage = '';
  successMessage = '';
  selectedMethod: 'card' | 'transfer' = 'card';

  form = this.fb.nonNullable.group({
    amount: [10000, [Validators.required, Validators.min(100)]],
    currency: ['NGN', Validators.required],
    purpose: ['General Donation' as DonationPurpose, Validators.required],
    donorName: [''],
    donorEmail: ['', [Validators.required, Validators.email]],
    anonymous: [false],
    recurring: [false],
  });

  constructor() {
    // Modal options are read from the shared signal when the modal is opened.
  }

  setAmount(amount: number): void {
    this.form.controls.amount.setValue(amount);
    this.form.controls.amount.markAsDirty();
  }

  selectMethod(method: 'card' | 'transfer'): void {
    this.selectedMethod = method;
    this.errorMessage = '';
  }

  close(): void {
    if (!this.loading) {
      this.modal.close();
      this.resetMessages();
    }
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    if (this.selectedMethod === 'transfer') {
      this.errorMessage =
        'Bank transfer instructions will be shown after the secure payment endpoint is connected.';
      return;
    }

    this.loading = true;

    this.donationService
      .initializePayment({
        amount: Number(value.amount),
        currency: value.currency,
        purpose: value.purpose,
        donorName: value.anonymous ? undefined : value.donorName || undefined,
        donorEmail: value.donorEmail,
        anonymous: value.anonymous,
        recurring: value.recurring,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.loading = false;

          // The backend must return a provider-generated checkout URL.
          // Never put a Paystack secret key in this Angular application.
          window.location.href = response.authorization_url;
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage =
            error?.error?.message ||
            'Unable to start the payment. Please try again.';
        },
      });
  }

  private resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}
