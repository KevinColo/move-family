import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import type { Observable } from 'rxjs';
import { WorkoutsService } from '../../services/workouts';
import type { Workout } from '../../models/workout';

@Component({
  selector: 'app-library',
  imports: [CommonModule, RouterLink],
  templateUrl: './library.html',
  styleUrl: './library.scss',
})
export class Library {
  workouts$: Observable<Workout[]>;

  constructor(private readonly workoutsService: WorkoutsService) {
    this.workouts$ = this.workoutsService.getAll();
  }
}
