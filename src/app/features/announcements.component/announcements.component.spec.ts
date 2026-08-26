import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementsComponent } from './announcements.component';

describe('AnnouncementsComponent', () => {
  let component: AnnouncementsComponent;
  let fixture: ComponentFixture<AnnouncementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnnouncementsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
