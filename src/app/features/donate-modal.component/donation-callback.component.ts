import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {DonationResultService} from '../../services/donation-result.service';
import {DonationService} from '../../services/donation.service';

/**
 * This route is only ever hit for a fraction of a second — it verifies
 * the donation in the background, hands the result to DonationResultService,
 * then redirects to the homepage where <app-donation-toast /> displays it.
 * No dedicated UI is shown here, so there's nothing to keep in sync
 * design-wise with the rest of the site.
 */
@Component({
  selector: 'app-donation-callback',
  standalone: true,
  template: '',
})
export class DonationCallbackComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly donationService = inject(DonationService);
  private readonly donationResult = inject(DonationResultService);

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    const reference = params.get('reference') || params.get('trxref') || '';

    if (!reference) {
      this.router.navigateByUrl('/');
      return;
    }

    this.donationService.verifyDonation(reference).subscribe({
      next: (res) => {
        this.donationResult.set({ ...res, reference });
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.donationResult.set({ status: 'not_found', reference });
        this.router.navigateByUrl('/');
      },
    });
  }
}
