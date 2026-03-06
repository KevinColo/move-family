import { Component } from '@angular/core';
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
  done = false;
  streak = 0;

  constructor(
    private workouts: WorkoutsService,
    private progress: ProgressService,
  ) {
    this.workout$ = this.workouts.getDaily();
    this.done = this.progress.hasCompletedToday();
    this.streak = this.progress.getStreak();
  }

  complete(): void {
    this.progress.completeToday();
    this.done = true;
    this.streak = this.progress.getStreak();
  }
}
