import { Component, DestroyRef, inject, input, signal, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import type { StepAnimation } from '../../models/workout';

export type TimerStep = {
  label: string;
  seconds: number;
  animationKey?: string;
  animation?: StepAnimation;
};

@Component({
  standalone: true,
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
  styleUrls: ['./timer.scss'],
})
export class Timer {
  steps = input.required<TimerStep[]>();

  running = signal(false);
  index = signal(0);
  remaining = signal(0);
  completed = signal(false);

  private readonly stop$ = new Subject<void>();
  private readonly destroyRef = inject(DestroyRef);

  currentLabel = computed(() => this.steps()[this.index()]?.label ?? '');
  currentAnimationKey = computed(() => this.steps()[this.index()]?.animationKey ?? '');
  currentAnimation = computed(() => this.steps()[this.index()]?.animation);
  hasSteps = computed(() => this.steps().length > 0);
  total = computed(() => this.steps().length);
  stepNumber = computed(() => this.index() + 1);

  start(): void {
    if (!this.hasSteps() || this.running()) return;

    if (this.remaining() === 0) {
      this.index.set(0);
      this.remaining.set(this.steps()[0]?.seconds ?? 0);
      this.completed.set(false);
    }

    this.running.set(true);

    interval(1000)
      .pipe(takeUntil(this.stop$), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.tick());
  }

  pause(): void {
    this.running.set(false);
    this.stop$.next();
  }

  reset(): void {
    this.pause();
    this.index.set(0);
    this.remaining.set(0);
    this.completed.set(false);
  }

  private tick(): void {
    const r = this.remaining();

    if (r <= 0) {
      const next = this.index() + 1;
      const allSteps = this.steps();

      if (next >= allSteps.length) {
        this.pause();
        this.completed.set(true);
        return;
      }

      this.index.set(next);
      this.remaining.set(allSteps[next]?.seconds ?? 0);
      return;
    }

    this.remaining.set(r - 1);
  }
}
