import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Daily } from './daily';

describe('Daily', () => {
  let component: Daily;
  let fixture: ComponentFixture<Daily>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [Daily],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Daily);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with done false and streak 0', () => {
    expect(component.done()).toBe(false);
    expect(component.streak()).toBe(0);
  });

  it('should reset done on backToChallenge', () => {
    component.done.set(true);
    component.backToChallenge();
    expect(component.done()).toBe(false);
  });
});
