import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IslamicCalendarComponent } from './islamic-calendar.component';

describe('IslamicCalendarComponent', () => {
  let component: IslamicCalendarComponent;
  let fixture: ComponentFixture<IslamicCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IslamicCalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IslamicCalendarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
