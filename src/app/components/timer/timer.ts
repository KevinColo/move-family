import { Component, EventEmitter, Input, OnDestroy, Output, signal, computed } from '@angular/core';

export type TimerStep = { label: string; seconds: number };

@Component({
  standalone: true,
  selector: 'app-timer',
  templateUrl: './timer.html',
  styleUrls: ['./timer.scss'],
})
export class Timer implements OnDestroy {
  @Input({ required: true }) steps: TimerStep[] = [];
  @Output() done = new EventEmitter<void>();

  running = signal(false);
  index = signal(0);
  remaining = signal(0);

  private id: number | null = null;

  currentLabel = computed(() => this.steps[this.index()]?.label ?? '');
  hasSteps = computed(() => this.steps.length > 0);
  total = computed(() => this.steps.length);
  stepNumber = computed(() => this.index() + 1);

  ngOnDestroy(): void {
    this.clear();
  }

  start(): void {
    if (!this.hasSteps() || this.running()) return;

    // init on first start
    if (this.remaining() === 0) {
      this.index.set(0);
      this.remaining.set(this.steps[0]?.seconds ?? 0);
    }

    this.running.set(true);
    this.id = window.setInterval(() => this.tick(), 1000);
  }

  pause(): void {
    this.running.set(false);
    this.clear();
  }

  reset(): void {
    this.pause();
    this.index.set(0);
    this.remaining.set(0);
  }

  private tick(): void {
    if (!this.running()) return;

    const r = this.remaining();

    // If current step finished, move to next immediately
    if (r <= 0) {
      const next = this.index() + 1;

      if (next >= this.steps.length) {
        this.pause();
        this.done.emit();
        return;
      }

      this.index.set(next);
      this.remaining.set(this.steps[next]?.seconds ?? 0);
      return;
    }

    // Otherwise decrement
    this.remaining.set(r - 1);
  }

  private clear(): void {
    if (this.id !== null) {
      window.clearInterval(this.id);
      this.id = null;
    }
  }
}
