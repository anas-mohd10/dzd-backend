import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() rating: number = 0;

  get fullStars(): number {
    return Math.floor(this.rating);
  }

  get hasHalfStar(): boolean {
    return this.rating - this.fullStars >= 0.5;
  }

  get emptyStars(): number {
    return 5 - Math.ceil(this.rating);
  }

}
