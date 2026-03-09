import { Component } from '@angular/core';
import { ProgressService } from '../../services/progress';

interface Badge {
  label: string;
  days: number;
  unlocked: boolean;
}

@Component({
  selector: 'app-rewards',
  imports: [],
  templateUrl: './rewards.html',
  styleUrl: './rewards.scss',
})
export class Rewards {
  streak: number;
  badges: Badge[];

  constructor(private progress: ProgressService) {
    this.streak = this.progress.getStreak();
    this.badges = [
      { label: '3 jours', days: 3, unlocked: this.streak >= 3 },
      { label: '7 jours', days: 7, unlocked: this.streak >= 7 },
      { label: '14 jours', days: 14, unlocked: this.streak >= 14 },
    ];
  }
}
