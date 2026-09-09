import { Injectable, signal } from '@angular/core';

import { DonationCurrency } from './donation.service';

export type DonationPurpose =
  'General Donation' | 'Zakat' | 'Sadaqah' | 'Orphans' | 'Food Distribution' | 'Education';

export interface DonationModalOptions {
  purpose?: DonationPurpose;
  amount?: number;
  currency?: DonationCurrency;
}

@Injectable({
  providedIn: 'root',
})
export class DonationModalService {
  private readonly _isOpen = signal(false);

  private readonly _options = signal<DonationModalOptions>({});

  readonly isOpen = this._isOpen.asReadonly();

  readonly options = this._options.asReadonly();

  // ============================================================
  // Open
  // ============================================================

  open(options: DonationModalOptions = {}): void {
    this._options.set(options);
    this._isOpen.set(true);
  }

  // ============================================================
  // Close
  // ============================================================

  close(): void {
    this._isOpen.set(false);
  }
}
