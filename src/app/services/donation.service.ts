import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class DonationService {
  private readonly http = inject(HttpClient);

  // Replace with your deployed Firebase HTTPS function URL.
  private readonly apiUrl = '/api/donations/initialize';

  initializePayment(
    payload: InitializeDonationRequest,
  ): Observable<InitializeDonationResponse> {
    return this.http.post<InitializeDonationResponse>(
      this.apiUrl,
      payload,
    );
  }
}
