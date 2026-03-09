import { Component, effect, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { type Observable, switchMap } from 'rxjs';
import { WorkoutsService } from '../../services/workouts';
import { ProgressService } from '../../services/progress';
import type { Workout } from '../../models/workout';
import { Timer } from '../../components/timer/timer';

@Component({
  standalone: true,
  selector: 'app-workout-detail',
  imports: [CommonModule, RouterLink, Timer],
  templateUrl: './workout-detail.html',
  styleUrl: './workout-detail.scss',
})
export class WorkoutDetail {
  workout$: Observable<Workout | undefined>;
  done = signal(false);
  streak = signal(0);

  private timer = viewChild(Timer);

  constructor(
    private route: ActivatedRoute,
    private workouts: WorkoutsService,
    private progress: ProgressService,
  ) {
    this.workout$ = this.route.params.pipe(
      switchMap((params) => this.workouts.getById(params['id'] as string)),
    );
    this.streak.set(this.progress.getStreak());

    effect(() => {
      if (this.timer()?.completed()) {
        this.progress.completeToday();
        this.done.set(true);
        this.streak.set(this.progress.getStreak());
      }
    });
  }
}
