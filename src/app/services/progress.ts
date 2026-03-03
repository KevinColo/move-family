import { Injectable } from '@angular/core';

type ProgressState = {
  completedDays: string[]; // YYYY-MM-DD
};

const STORAGE_KEY = 'move-family-progress';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private read(): ProgressState {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedDays: [] };
    return JSON.parse(raw) as ProgressState;
  }

  private write(state: ProgressState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private todayKey(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  hasCompletedToday(): boolean {
    const state = this.read();
    return state.completedDays.includes(this.todayKey());
  }

  completeToday(): void {
    const state = this.read();
    const key = this.todayKey();
    if (!state.completedDays.includes(key)) {
      state.completedDays.push(key);
      this.write(state);
    }
  }

  getStreak(): number {
    const state = this.read();
    const set = new Set(state.completedDays);

    let streak = 0;
    const d = new Date();
    while (true) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!set.has(key)) break;
      streak += 1;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }
}
