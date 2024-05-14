import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-start-rating',
  templateUrl: './start-rating.component.html',
  styleUrls: ['./start-rating.component.scss']
})
export class StartRatingComponent implements OnInit {
  @Input() rating: number;

  constructor() { }

  ngOnInit(): void {
  }

  getFullStars(): number[] {
    const fullStarsCount = Math.floor(this.rating);
    return Array(fullStarsCount).fill(0);
  }

  hasHalfStar(): boolean {
    return this.rating - Math.floor(this.rating) >= 0.5;
  }

  getEmptyStars(): number[] {
    const emptyStarsCount = Math.floor(5 - this.rating);
    return Array(emptyStarsCount).fill(0);
  }

}
