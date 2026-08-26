import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IslamicResourcesComponent } from './islamic-resources.component';

describe('IslamicResourcesComponent', () => {
  let component: IslamicResourcesComponent;
  let fixture: ComponentFixture<IslamicResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IslamicResourcesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IslamicResourcesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
