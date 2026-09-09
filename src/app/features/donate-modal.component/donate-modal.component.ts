import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DonationModalService, DonationPurpose } from '../../services/donation-modal.service';

import { DonationService, DonationCurrency } from '../../services/donation.service';

interface Currency {
  readonly code: DonationCurrency;
  readonly symbol: string;
  readonly name: string;
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

  // ============================================================
  // Donation purposes
  // ============================================================

  readonly purposes: DonationPurpose[] = [
    'General Donation',
    'Zakat',
    'Sadaqah',
    'Orphans',
    'Food Distribution',
    'Education',
  ];

  // ============================================================
  // Supported currencies
  // ============================================================

  readonly currencies: Currency[] = [
    {
      code: 'NGN',
      symbol: '₦',
      name: 'Nigerian Naira',
    },
    {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
    },
  ];

  // ============================================================
  // Quick donation amounts
  // ============================================================

  readonly quickAmountsByCurrency: Record<DonationCurrency, readonly number[]> = {
    NGN: [5000, 10000, 25000, 50000],
    USD: [10, 25, 50, 100],
  };

  // ============================================================
  // Bank transfer details
  // ============================================================

  readonly bankDetails = {
    bankName: 'HSBC',
    accountName: 'Alfiqh Nigerian Islamic Trust',
    accountNumber: '62826674',
    sortCode: '40-25-27',
    routingNumber: '45788099',
    bic: 'REVOGB21',
    iban: 'GB41REVO00996963993423',
    bankAddress: '7 Westferry Circus, E14 4HD, London, United Kingdom',
    referenceHint: 'Please use your name or donation purpose as the transfer reference.',
  };

  // ============================================================
  // Payment method
  // ============================================================

  selectedMethod: 'card' | 'transfer' = 'card';

  // ============================================================
  // State
  // ============================================================

  loading = false;
  errorMessage = '';
  successMessage = '';

  // ============================================================
  // Form
  // ============================================================

  readonly form = this.fb.nonNullable.group({
    amount: [10000, [Validators.required, Validators.min(100)]],

    currency: ['NGN' as DonationCurrency, Validators.required],

    purpose: ['General Donation' as DonationPurpose, Validators.required],

    donorName: [''],

    donorEmail: ['', [Validators.required, Validators.email]],

    anonymous: [false],

    recurring: [false],
  });

  constructor() {
    // ----------------------------------------------------------
    // Automatically change the default amount when currency
    // changes.
    // ----------------------------------------------------------

    this.form.controls.currency.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((currency) => {
        this.errorMessage = '';
        this.successMessage = '';

        if (currency === 'USD') {
          this.form.controls.amount.setValue(25);
        } else {
          this.form.controls.amount.setValue(10000);
        }

        this.form.controls.amount.markAsPristine();
        this.form.controls.amount.updateValueAndValidity();
      });
  }

  // ============================================================
  // Current currency
  // ============================================================

  get currentCurrency(): DonationCurrency {
    return this.form.controls.currency.value;
  }

  get currentCurrencyInfo(): Currency {
    return (
      this.currencies.find((currency) => currency.code === this.currentCurrency) ??
      this.currencies[0]
    );
  }

  get currentSymbol(): string {
    return this.currentCurrencyInfo.symbol;
  }

  get quickAmounts(): readonly number[] {
    return this.quickAmountsByCurrency[this.currentCurrency];
  }

  get minimumAmount(): number {
    return this.currentCurrency === 'USD' ? 1 : 100;
  }

  get amountPlaceholder(): string {
    return this.currentCurrency === 'USD' ? '25' : '10,000';
  }

  // ============================================================
  // Payment method
  // ============================================================

  selectMethod(method: 'card' | 'transfer'): void {
    if (this.loading) {
      return;
    }

    this.selectedMethod = method;

    this.errorMessage = '';
    this.successMessage = '';

    // Both payment methods currently support the same
    // currencies, so there is no need to reset the currency.
  }

  // ============================================================
  // Quick amount
  // ============================================================

  setAmount(amount: number): void {
    this.form.controls.amount.setValue(amount);
    this.form.controls.amount.markAsDirty();
    this.form.controls.amount.updateValueAndValidity();

    this.errorMessage = '';
    this.successMessage = '';
  }

  // ============================================================
  // Close
  // ============================================================

  close(): void {
    if (this.loading) {
      return;
    }

    this.modal.close();
    this.resetMessages();
  }

  // ============================================================
  // Submit
  // ============================================================

  submit(): void {
    this.resetMessages();

    if (this.loading) {
      return;
    }

    // ----------------------------------------------------------
    // Validate form
    // ----------------------------------------------------------

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.errorMessage = 'Please check the donation details and try again.';

      return;
    }

    const value = this.form.getRawValue();

    // ----------------------------------------------------------
    // Currency
    // ----------------------------------------------------------

    const currency = value.currency;

    if (currency !== 'NGN' && currency !== 'USD') {
      this.errorMessage = 'Please select a valid donation currency.';

      return;
    }

    // ----------------------------------------------------------
    // Amount
    // ----------------------------------------------------------

    const amount = Number(value.amount);

    const minimumAmount = currency === 'USD' ? 1 : 100;

    if (!Number.isFinite(amount) || amount < minimumAmount) {
      this.errorMessage =
        currency === 'USD'
          ? 'Please enter a valid USD donation amount of at least $1.'
          : 'Please enter a valid NGN donation amount of at least ₦100.';

      return;
    }

    // ----------------------------------------------------------
    // Donor name
    // ----------------------------------------------------------

    const donorName = value.anonymous ? undefined : value.donorName.trim() || undefined;

    // ----------------------------------------------------------
    // Bank transfer
    // ----------------------------------------------------------

    if (this.selectedMethod === 'transfer') {
      this.successMessage =
        'Please complete your bank transfer using the account details shown above.';

      return;
    }

    // ----------------------------------------------------------
    // Card payment
    // ----------------------------------------------------------

    this.loading = true;

    const request = {
      amount,
      currency,
      purpose: value.purpose,
      donorName,
      donorEmail: value.donorEmail.trim(),
      anonymous: value.anonymous,
      recurring: value.recurring,
    };

    console.log('Submitting donation:', request);

    this.donationService
      .initializePayment(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.loading = false;

          console.log('Donation initialization successful:', response);

          if (!response || !response.authorization_url) {
            this.errorMessage = 'Payment checkout could not be created. Please try again.';

            return;
          }

          // ----------------------------------------------------
          // Redirect to Paystack
          // ----------------------------------------------------

          window.location.assign(response.authorization_url);
        },

        error: (error) => {
          this.loading = false;

          console.error('Donation initialization failed:', error);

          // ----------------------------------------------------
          // Network error
          // ----------------------------------------------------

          if (error?.status === 0) {
            this.errorMessage =
              'Unable to connect to the payment service. Please check your connection and try again.';

            return;
          }

          // ----------------------------------------------------
          // Backend error
          // ----------------------------------------------------

          const backendError = error?.error;

          if (typeof backendError === 'string' && backendError.trim()) {
            this.errorMessage = backendError;

            return;
          }

          if (backendError?.error) {
            this.errorMessage = backendError.error;

            return;
          }

          if (backendError?.message) {
            this.errorMessage = backendError.message;

            return;
          }

          if (error?.message) {
            this.errorMessage = error.message;

            return;
          }

          this.errorMessage =
            currency === 'USD'
              ? 'Unable to start the USD payment. Please try again.'
              : 'Unable to start the payment. Please try again.';
        },
      });
  }

  // ============================================================
  // Reset messages
  // ============================================================

  private resetMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  // ============================================================
  // Copy account number
  // ============================================================

  copyAccountNumber(): void {
    if (!navigator.clipboard) {
      this.errorMessage = 'Copying is not supported by this browser.';

      return;
    }

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
