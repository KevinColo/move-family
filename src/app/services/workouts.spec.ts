import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { WorkoutsService } from './workouts';
import type { Workout } from '../models/workout';

const MOCK_WORKOUTS: Workout[] = [
  { id: 'w1', title: 'Workout A', minutes: 5, ageMin: 5, tags: ['fun'], steps: [{ label: 'Step 1', seconds: 30 }] },
  { id: 'w2', title: 'Workout B', minutes: 10, ageMin: 6, tags: ['cardio'], steps: [{ label: 'Step 1', seconds: 20 }] },
];

describe('WorkoutsService', () => {
  let service: WorkoutsService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(WorkoutsService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should fetch all workouts', () => {
    let result: Workout[] = [];
    service.getAll().subscribe((w) => (result = w));

    const req = httpTesting.expectOne('assets/workouts.json');
    req.flush(MOCK_WORKOUTS);

    expect(result).toHaveLength(2);
    expect(result[0]?.id).toBe('w1');
  });

  it('should find a workout by id', () => {
    let result: Workout | undefined;
    service.getById('w2').subscribe((w) => (result = w));

    const req = httpTesting.expectOne('assets/workouts.json');
    req.flush(MOCK_WORKOUTS);

    expect(result?.id).toBe('w2');
    expect(result?.title).toBe('Workout B');
  });

  it('should return undefined for unknown id', () => {
    let result: Workout | undefined = MOCK_WORKOUTS[0];
    service.getById('unknown').subscribe((w) => (result = w));

    const req = httpTesting.expectOne('assets/workouts.json');
    req.flush(MOCK_WORKOUTS);

    expect(result).toBeUndefined();
  });

  it('should return a daily workout', () => {
    let result: Workout | undefined;
    service.getDaily().subscribe((w) => (result = w));

    const req = httpTesting.expectOne('assets/workouts.json');
    req.flush(MOCK_WORKOUTS);

    expect(result).toBeDefined();
    expect(MOCK_WORKOUTS.some((w) => w.id === result?.id)).toBe(true);
  });

  it('should cache workouts with shareReplay', () => {
    service.getAll().subscribe();
    service.getAll().subscribe();

    httpTesting.expectOne('assets/workouts.json').flush(MOCK_WORKOUTS);
    // Only one request should have been made
  });
});
