import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Madarasa } from './madarasa';

describe('Madarasa', () => {
  let component: Madarasa;
  let fixture: ComponentFixture<Madarasa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Madarasa],
    }).compileComponents();

    fixture = TestBed.createComponent(Madarasa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
