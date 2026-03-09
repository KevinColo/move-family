import { ProgressService } from './progress';

const STORAGE_KEY = 'move-family-progress';

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return formatDate(d);
}

describe('ProgressService', () => {
  let service: ProgressService;

  beforeEach(() => {
    localStorage.clear();
    service = new ProgressService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('hasCompletedToday', () => {
    it('should return false when no data', () => {
      expect(service.hasCompletedToday()).toBe(false);
    });

    it('should return true after completing today', () => {
      service.completeToday();
      expect(service.hasCompletedToday()).toBe(true);
    });
  });

  describe('completeToday', () => {
    it('should not duplicate if called twice', () => {
      service.completeToday();
      service.completeToday();
      expect(service.getCompletedDays()).toHaveLength(1);
    });

    it('should store today in YYYY-MM-DD format', () => {
      service.completeToday();
      const days = service.getCompletedDays();
      expect(days[0]).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(days[0]).toBe(formatDate(new Date()));
    });
  });

  describe('getStreak', () => {
    it('should return 0 when no data', () => {
      expect(service.getStreak()).toBe(0);
    });

    it('should return 1 after completing today', () => {
      service.completeToday();
      expect(service.getStreak()).toBe(1);
    });

    it('should count consecutive days', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          completedDays: [daysAgo(2), daysAgo(1), daysAgo(0)],
          unlockedBadges: [],
        }),
      );
      expect(service.getStreak()).toBe(3);
    });

    it('should break streak on missing day', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          completedDays: [daysAgo(3), daysAgo(1), daysAgo(0)],
          unlockedBadges: [],
        }),
      );
      expect(service.getStreak()).toBe(2);
    });

    it('should return 0 if today not completed', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          completedDays: [daysAgo(1)],
          unlockedBadges: [],
        }),
      );
      expect(service.getStreak()).toBe(0);
    });
  });

  describe('getCompletedDays', () => {
    it('should return empty array when no data', () => {
      expect(service.getCompletedDays()).toEqual([]);
    });

    it('should return days as stored', () => {
      const expected = [daysAgo(2), daysAgo(1), daysAgo(0)].sort();
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          completedDays: expected,
          unlockedBadges: [],
        }),
      );
      expect(service.getCompletedDays()).toEqual(expected);
    });
  });

  describe('getBadges', () => {
    it('should return all badges locked by default', () => {
      const badges = service.getBadges();
      expect(badges.length).toBeGreaterThanOrEqual(4);
      expect(badges.every((b) => !b.unlocked)).toBe(true);
    });

    it('should unlock streak-3 badge when persisted', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          completedDays: [],
          unlockedBadges: ['streak-3'],
        }),
      );
      const badges = service.getBadges();
      const streak3 = badges.find((b) => b.id === 'streak-3');
      expect(streak3?.unlocked).toBe(true);
    });

    it('should persist badge after streak unlock via completeToday', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          completedDays: [daysAgo(2), daysAgo(1)],
          unlockedBadges: [],
        }),
      );
      service.completeToday();
      const badges = service.getBadges();
      const streak3 = badges.find((b) => b.id === 'streak-3');
      expect(streak3?.unlocked).toBe(true);
    });
  });

  describe('migration', () => {
    it('should migrate legacy data without version field', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ completedDays: [daysAgo(0)] }),
      );
      expect(service.hasCompletedToday()).toBe(true);

      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
      expect(raw).toHaveProperty('version', 1);
      expect(raw).toHaveProperty('unlockedBadges');
    });

    it('should reset on corrupted JSON', () => {
      localStorage.setItem(STORAGE_KEY, '{{{not json');
      expect(service.hasCompletedToday()).toBe(false);
      expect(service.getCompletedDays()).toEqual([]);
    });

    it('should reset on invalid schema', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, completedDays: [123] }));
      expect(service.getCompletedDays()).toEqual([]);
    });
  });
});
