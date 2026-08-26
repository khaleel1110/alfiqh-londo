import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportUsComponent } from './support-us.component';

describe('SupportUsComponent', () => {
  let component: SupportUsComponent;
  let fixture: ComponentFixture<SupportUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportUsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportUsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
