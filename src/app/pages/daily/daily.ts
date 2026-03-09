import { Component, effect, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Observable } from 'rxjs';
import { WorkoutsService } from '../../services/workouts';
import { ProgressService } from '../../services/progress';
import type { Workout } from '../../models/workout';
import { Timer } from '../../components/timer/timer';

@Component({
  standalone: true,
  selector: 'app-daily',
  imports: [CommonModule, Timer],
  templateUrl: './daily.html',
  styleUrl: './daily.scss',
})
export class Daily {
  workout$: Observable<Workout>;
  done = signal(false);
  streak = signal(0);

  private timer = viewChild(Timer);

  constructor(
    private workouts: WorkoutsService,
    private progress: ProgressService,
  ) {
    this.workout$ = this.workouts.getDaily();
    this.done.set(this.progress.hasCompletedToday());
    this.streak.set(this.progress.getStreak());

    effect(() => {
      if (this.timer()?.completed()) {
        this.progress.completeToday();
        this.done.set(true);
        this.streak.set(this.progress.getStreak());
      }
    });
  }

  backToChallenge(): void {
    this.done.set(false);
  }
}
