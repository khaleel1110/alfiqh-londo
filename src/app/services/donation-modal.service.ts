import { Injectable, signal } from '@angular/core';

export type DonationPurpose =
  | 'General Donation'
  | 'Zakat'
  | 'Sadaqah'
  | 'Orphans'
  | 'Food Distribution'
  | 'Education';

export interface DonationModalOptions {
  purpose?: DonationPurpose;
  amount?: number;
  currency?: string;
}

@Injectable({ providedIn: 'root' })
export class DonationModalService {
  private _isOpen = signal(false);
  private _options = signal<DonationModalOptions>({});

  readonly isOpen = this._isOpen.asReadonly();
  readonly options = this._options.asReadonly();

  open(options: DonationModalOptions = {}): void {
    this._options.set(options);
    this._isOpen.set(true);
  }

  close(): void {
    this._isOpen.set(false);
  }
}
