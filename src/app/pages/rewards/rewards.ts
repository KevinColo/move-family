import { Component } from '@angular/core';
import { type Badge, ProgressService } from '../../services/progress';

@Component({
  selector: 'app-rewards',
  imports: [],
  templateUrl: './rewards.html',
  styleUrl: './rewards.scss',
})
export class Rewards {
  streak: number;
  totalDays: number;
  badges: Badge[];

  constructor(private progress: ProgressService) {
    this.streak = this.progress.getStreak();
    this.totalDays = this.progress.getCompletedDays().length;
    this.badges = this.progress.getBadges();
  }
}
