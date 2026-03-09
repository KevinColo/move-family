import { Injectable } from '@angular/core';
import { z } from 'zod/v4';

const STORAGE_KEY = 'move-family-progress';
const CURRENT_VERSION = 1;

const progressSchema = z.object({
  version: z.number(),
  completedDays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  unlockedBadges: z.array(z.string()),
});

const legacySchema = z.object({
  completedDays: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
});

type ProgressState = z.infer<typeof progressSchema>;

export interface Badge {
  id: string;
  label: string;
  days: number;
  unlocked: boolean;
}

const BADGE_DEFS: ReadonlyArray<{ id: string; label: string; days: number }> = [
  { id: 'streak-3', label: '3 jours', days: 3 },
  { id: 'streak-7', label: '7 jours', days: 7 },
  { id: 'streak-14', label: '14 jours', days: 14 },
  { id: 'streak-30', label: '30 jours', days: 30 },
];

function emptyState(): ProgressState {
  return { version: CURRENT_VERSION, completedDays: [], unlockedBadges: [] };
}

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private read(): ProgressState {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return emptyState();
    }

    // Try current schema
    const current = progressSchema.safeParse(parsed);
    if (current.success) return current.data;

    // Try legacy schema (v0, no version field)
    const legacy = legacySchema.safeParse(parsed);
    if (legacy.success) {
      const migrated: ProgressState = {
        version: CURRENT_VERSION,
        completedDays: [...legacy.data.completedDays].sort(),
        unlockedBadges: [],
      };
      this.write(migrated);
      return migrated;
    }

    // Corrupted data — reset
    localStorage.removeItem(STORAGE_KEY);
    return emptyState();
  }

  private write(state: ProgressState): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  private formatDate(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  hasCompletedToday(): boolean {
    return this.read().completedDays.includes(this.formatDate(new Date()));
  }

  completeToday(): void {
    const state = this.read();
    const key = this.formatDate(new Date());
    if (!state.completedDays.includes(key)) {
      state.completedDays.push(key);
      state.completedDays.sort();
    }

    // Check badge unlocks based on current streak
    const streak = this.computeStreak(state);
    for (const def of BADGE_DEFS) {
      if (streak >= def.days && !state.unlockedBadges.includes(def.id)) {
        state.unlockedBadges.push(def.id);
      }
    }

    this.write(state);
  }

  getStreak(): number {
    return this.computeStreak(this.read());
  }

  getCompletedDays(): string[] {
    return this.read().completedDays;
  }

  getBadges(): Badge[] {
    const unlocked = new Set(this.read().unlockedBadges);
    return BADGE_DEFS.map((def) => ({ ...def, unlocked: unlocked.has(def.id) }));
  }

  private computeStreak(state: ProgressState): number {
    const set = new Set(state.completedDays);
    let streak = 0;
    const d = new Date();

    while (set.has(this.formatDate(d))) {
      streak += 1;
      d.setDate(d.getDate() - 1);
    }

    return streak;
  }
}
