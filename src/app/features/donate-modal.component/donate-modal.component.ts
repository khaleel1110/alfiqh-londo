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
import { DonationModalService, DonationPurpose } from '../../services/donation-modal.service';
import { DonationService } from '../../services/donation.service';


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

  // Replace the bankDetails block in donate-modal.component.ts with this:

  readonly bankDetails = {
    bankName: 'Revolut',
    accountName: 'Alfiqh London',
    accountNumber: '123457890',
    sortCode: '', // Not applicable — international transfer uses routing/IBAN below instead
    routingNumber: '45788099',
    bic: 'REVOGB21',
    iban: 'GB41REVO00996963993423',
    bankAddress: '7 Westferry Circus, E14 4HD, London, United Kingdom',
    referenceHint: 'Please use your name or donation purpose as the transfer reference.',
  };

  // donate-modal.component.ts

  readonly cardCurrencies: Currency[] = [
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
  ];

  readonly transferCurrencies: Currency[] = [
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
  ];

  get availableCurrencies(): Currency[] {
    return this.selectedMethod === 'card' ? this.cardCurrencies : this.transferCurrencies;
  }

  currentSymbol(): string {
    const code = this.form.controls.currency.value;
    return this.availableCurrencies.find((c) => c.code === code)?.symbol ?? '';
  }

  selectMethod(method: 'card' | 'transfer'): void {
    this.selectedMethod = method;
    this.errorMessage = '';

    // If switching to card and the current currency isn't supported, reset it
    if (
      method === 'card' &&
      !this.cardCurrencies.some((c) => c.code === this.form.controls.currency.value)
    ) {
      this.form.controls.currency.setValue('NGN');
    }
  }

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

  /*
  selectMethod(method: 'card' | 'transfer'): void {
    this.selectedMethod = method;
    this.errorMessage = '';
  }
*/

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

    // -----------------------------------------
    // BANK TRANSFER
    // -----------------------------------------
    if (this.selectedMethod === 'transfer') {
      this.successMessage = 'Please complete the bank transfer using the account details below.';

      return;
    }

    // -----------------------------------------
    // CARD PAYMENT
    // -----------------------------------------
    // CARD PAYMENT
    if (!this.cardCurrencies.some((c) => c.code === value.currency)) {
      this.errorMessage = `Card payment in ${value.currency} isn't supported yet. Please use NGN or USD, or pay by bank transfer.`;
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

          if (!response?.authorization_url) {
            this.errorMessage = 'Payment checkout could not be created. Please try again.';
            return;
          }

          window.location.href = response.authorization_url;
        },

        error: (error) => {
          this.loading = false;

          console.error('Donation initialization failed:', error);

          this.errorMessage =
            error?.error?.message || 'Unable to start the payment. Please try again.';
        },
      });
  }

  private resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  copyAccountNumber(): void {
    navigator.clipboard
      .writeText(this.bankDetails.accountNumber)
      .then(() => {
        this.successMessage = 'Account number copied.';
      })
      .catch(() => {
        this.errorMessage = 'Unable to copy the account number.';
      });
  }
}
