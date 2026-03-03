import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkoutsService } from '../../services/workouts';
import { ProgressService } from '../../services/progress';
import { Workout } from '../../models/workout';
import { Timer } from '../../components/timer/timer';

@Component({
  standalone: true,
  selector: 'app-daily',
  imports: [CommonModule, Timer],
  templateUrl: './daily.html',
  styleUrl: './daily.scss',
})
export class Daily implements OnInit {
  workout?: Workout;
  done = false;
  streak = 0;

  constructor(
    private workouts: WorkoutsService,
    private progress: ProgressService
  ) {}

  ngOnInit(): void {
    this.done = this.progress.hasCompletedToday();
    this.streak = this.progress.getStreak();

    this.workouts.getDaily().subscribe((w) => (this.workout = w));
  }

  complete(): void {
    this.progress.completeToday();
    this.done = true;
    this.streak = this.progress.getStreak();
  }
}
