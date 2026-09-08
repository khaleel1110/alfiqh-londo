import { Injectable, signal } from '@angular/core';
import { DonationStatusResponse } from './donation.service';

const STORAGE_KEY = 'donation_result';

export interface DonationResult extends DonationStatusResponse {
  reference: string;
}

/**
 * Passes the outcome of a Paystack redirect across a navigation.
 * The callback route writes the result and immediately redirects home;
 * whichever page the user lands on reads (and clears) it once.
 */
@Injectable({ providedIn: 'root' })
export class DonationResultService {
  readonly result = signal<DonationResult | null>(null);

  set(result: DonationResult): void {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  }

  /** Reads the pending result (if any) and clears it so it only shows once. */
  consume(): DonationResult | null {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    sessionStorage.removeItem(STORAGE_KEY);

    try {
      const parsed = JSON.parse(raw) as DonationResult;
      this.result.set(parsed);
      return parsed;
    } catch {
      return null;
    }
  }

  clear(): void {
    this.result.set(null);
  }
}
