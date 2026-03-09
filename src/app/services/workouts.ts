import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import type { Workout } from '../models/workout';

@Injectable({ providedIn: 'root' })
export class WorkoutsService {
  private readonly workouts$: Observable<Workout[]>;

  constructor(private readonly http: HttpClient) {
    this.workouts$ = this.http.get<Workout[]>('assets/workouts.json').pipe(shareReplay(1));
  }

  getAll(): Observable<Workout[]> {
    return this.workouts$;
  }

  getById(id: string): Observable<Workout | undefined> {
    return this.workouts$.pipe(map((workouts) => workouts.find((w) => w.id === id)));
  }

  getDaily(): Observable<Workout> {
    return this.workouts$.pipe(
      map((workouts) => {
        if (workouts.length === 0) {
          throw new Error('workouts.json is empty');
        }

        const today = new Date();
        const key = Number(
          `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`,
        );

        const index = key % workouts.length;
        const workout = workouts[index];

        if (!workout) {
          throw new Error('Daily workout not found');
        }

        return workout;
      }),
    );
  }
}
