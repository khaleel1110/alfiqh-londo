import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurImpactComponent } from './our-impact.component';

describe('OurImpactComponent', () => {
  let component: OurImpactComponent;
  let fixture: ComponentFixture<OurImpactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurImpactComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OurImpactComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
