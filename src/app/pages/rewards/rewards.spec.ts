import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Rewards } from './rewards';

describe('Rewards', () => {
  let component: Rewards;
  let fixture: ComponentFixture<Rewards>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Rewards],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(Rewards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have streak 0 and totalDays 0 initially', () => {
    expect(component.streak).toBe(0);
    expect(component.totalDays).toBe(0);
  });

  it('should have at least 4 badges', () => {
    expect(component.badges.length).toBeGreaterThanOrEqual(4);
  });

  it('should have all badges locked by default', () => {
    expect(component.badges.every((b) => !b.unlocked)).toBe(true);
  });
});
