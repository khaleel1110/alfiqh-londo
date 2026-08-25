import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Define payload structure
export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  // 👉 move this later to environment.ts
  private url = 'https://us-central1-kib-software-solutions.cloudfunctions.net/emailConactusSender-contactUs';

  constructor(private http: HttpClient) {}

  sendMessage(data: ContactPayload): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.url, data).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Something went wrong. Please try again.';

    if (error.error?.error) {
      errorMessage = error.error.error;
    }

    console.error('ContactService Error:', error);

    return throwError(() => new Error(errorMessage));
  }
}
