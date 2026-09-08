import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationToastComponent } from './donation-toast.component';

describe('DonationToastComponent', () => {
  let component: DonationToastComponent;
  let fixture: ComponentFixture<DonationToastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationToastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DonationToastComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
