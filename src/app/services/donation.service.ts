import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface InitializeDonationRequest {
  amount: number;
  currency: string;
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
  currency?: string;
  purpose?: string;
}

@Injectable({ providedIn: 'root' })
export class DonationService {
  private readonly http = inject(HttpClient);

  initializePayment(
      payload: InitializeDonationRequest,
  ): Observable<InitializeDonationResponse> {
    return this.http.post<InitializeDonationResponse>(
        environment.initializeDonationUrl,
        { ...payload, origin: window.location.origin },
    );
  }

  verifyDonation(reference: string): Observable<DonationStatusResponse> {
    return this.http.get<DonationStatusResponse>(
      `${environment.verifyDonationUrl}?reference=${encodeURIComponent(reference)}`,
    );
  }
}
