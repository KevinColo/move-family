import { Component, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { vi } from 'vitest';
import { Timer, type TimerStep } from './timer';

const STEPS: TimerStep[] = [
  { label: 'Step 1', seconds: 3 },
  { label: 'Step 2', seconds: 2 },
];

@Component({
  standalone: true,
  imports: [Timer],
  template: '<app-timer [steps]="steps" />',
})
class TestHost {
  steps: TimerStep[] = STEPS;
  timer = viewChild.required(Timer);
}

describe('Timer', () => {
  let fixture: ComponentFixture<TestHost>;
  let timer: Timer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    await fixture.whenStable();
    timer = fixture.componentInstance.timer();

    vi.useFakeTimers();
  });

  afterEach(() => {
    timer.pause();
    vi.useRealTimers();
  });

  it('should create', () => {
    expect(timer).toBeTruthy();
  });

  it('should have correct initial state', () => {
    expect(timer.running()).toBe(false);
    expect(timer.index()).toBe(0);
    expect(timer.remaining()).toBe(0);
    expect(timer.completed()).toBe(false);
  });

  it('should compute hasSteps correctly', () => {
    expect(timer.hasSteps()).toBe(true);
  });

  it('should compute total and stepNumber', () => {
    expect(timer.total()).toBe(2);
    expect(timer.stepNumber()).toBe(1);
  });

  it('should compute currentLabel', () => {
    expect(timer.currentLabel()).toBe('Step 1');
  });

  it('should set remaining and running on start', () => {
    timer.start();
    expect(timer.running()).toBe(true);
    expect(timer.remaining()).toBe(3);
  });

  it('should tick down each second', () => {
    timer.start();
    expect(timer.remaining()).toBe(3);

    vi.advanceTimersByTime(1000);
    expect(timer.remaining()).toBe(2);

    vi.advanceTimersByTime(1000);
    expect(timer.remaining()).toBe(1);
  });

  it('should advance to next step when remaining reaches 0', () => {
    // Steps: [3s, 2s]. Ticks at 1s/2s/3s decrement 3→2→1→0.
    // Tick at 4s sees remaining=0, advances to step 2.
    timer.start();
    vi.advanceTimersByTime(4000);
    expect(timer.index()).toBe(1);
    expect(timer.currentLabel()).toBe('Step 2');
    expect(timer.remaining()).toBe(2);
  });

  it('should set completed when all steps done', () => {
    // Step 1: 3s to reach 0 + 1s to advance = 4s
    // Step 2: 2s to reach 0 + 1s to detect completion = 3s
    timer.start();
    vi.advanceTimersByTime(7000);

    expect(timer.completed()).toBe(true);
    expect(timer.running()).toBe(false);
  });

  it('should pause and resume', () => {
    timer.start();
    vi.advanceTimersByTime(1000);
    expect(timer.remaining()).toBe(2);

    timer.pause();
    expect(timer.running()).toBe(false);

    vi.advanceTimersByTime(2000);
    expect(timer.remaining()).toBe(2);

    timer.start();
    expect(timer.running()).toBe(true);

    vi.advanceTimersByTime(1000);
    expect(timer.remaining()).toBe(1);
  });

  it('should reset to initial state', () => {
    timer.start();
    vi.advanceTimersByTime(1000);
    timer.reset();

    expect(timer.running()).toBe(false);
    expect(timer.index()).toBe(0);
    expect(timer.remaining()).toBe(0);
    expect(timer.completed()).toBe(false);
  });
});
