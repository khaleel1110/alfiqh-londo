import { Injectable, inject } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { catchError, timeout } from 'rxjs/operators';

import { environment } from '../../environments/environment';

export type DonationCurrency = 'NGN' | 'USD';

export interface InitializeDonationRequest {
  amount: number;
  currency: DonationCurrency;
  purpose: string;
  donorName?: string;
  donorEmail: string;
  anonymous: boolean;
  recurring: boolean;
}

export interface InitializeDonationResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface DonationStatusResponse {
  status: 'pending' | 'paid' | 'not_found';

  amount?: number;

  currency?: DonationCurrency;

  purpose?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  private readonly http = inject(HttpClient);

  // ============================================================
  // Initialize Paystack payment
  // ============================================================

  initializePayment(payload: InitializeDonationRequest): Observable<InitializeDonationResponse> {
    const request = {
      amount: Number(payload.amount),
      currency: payload.currency,
      purpose: payload.purpose,
      donorName: payload.donorName,
      donorEmail: payload.donorEmail.trim(),
      anonymous: Boolean(payload.anonymous),
      recurring: Boolean(payload.recurring),
      origin: window.location.origin,
    };

    console.log('Donation initialization request:', request);

    return this.http
      .post<InitializeDonationResponse>(environment.initializeDonationUrl, request)
      .pipe(
        timeout(30000),

        catchError((error: HttpErrorResponse) => {
          console.error('Donation initialization error:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            response: error.error,
          });

          return throwError(() => error);
        }),
      );
  }

  // ============================================================
  // Verify donation
  // ============================================================

  verifyDonation(reference: string): Observable<DonationStatusResponse> {
    const encodedReference = encodeURIComponent(reference.trim());

    return this.http
      .get<DonationStatusResponse>(`${environment.verifyDonationUrl}?reference=${encodedReference}`)
      .pipe(
        timeout(15000),

        catchError((error: HttpErrorResponse) => {
          console.error('Donation verification error:', {
            status: error.status,
            statusText: error.statusText,
            url: error.url,
            response: error.error,
          });

          return throwError(() => error);
        }),
      );
  }
}
