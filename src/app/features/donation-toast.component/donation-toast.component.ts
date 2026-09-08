import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationResultService } from '../../services/donation-result.service';

@Component({
  selector: 'app-donation-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (donationResult.result(); as result) {
      <div class="donation-toast" [class.success]="result.status === 'paid'"
                                   [class.pending]="result.status === 'pending'"
                                   [class.failed]="result.status === 'not_found'">
        <div class="toast-icon">
          @if (result.status === 'paid') {
            <i class="bi bi-check-circle-fill"></i>
          } @else if (result.status === 'pending') {
            <i class="bi bi-hourglass-split"></i>
          } @else {
            <i class="bi bi-exclamation-circle"></i>
          }
        </div>

        <div class="toast-body">
          @if (result.status === 'paid') {
            <strong>Jazakumullahu Khairan!</strong>
            <p>
              Your donation
              @if (result.amount && result.currency) {
                of {{ result.amount }} {{ result.currency }}
              }
              was received. A confirmation email is on its way.
            </p>
          } @else if (result.status === 'pending') {
            <strong>Payment Processing</strong>
            <p>We're still confirming your payment — check your email shortly.</p>
          } @else {
            <strong>We couldn't confirm that donation</strong>
            <p>If you were charged, please contact us with reference {{ result.reference }}.</p>
          }
        </div>

        <button type="button" class="toast-close" aria-label="Dismiss" (click)="dismiss()">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    }
  `,
  styleUrl: './donation-toast.component.scss',
})
export class DonationToastComponent implements OnInit {
  readonly donationResult = inject(DonationResultService);

  ngOnInit(): void {
    this.donationResult.consume();

    // Auto-dismiss a successful donation after a few seconds; leave
    // pending/failed visible until the user closes it themselves.
    if (this.donationResult.result()?.status === 'paid') {
      setTimeout(() => this.dismiss(), 6000);
    }
  }

  dismiss(): void {
    this.donationResult.clear();
  }
}
