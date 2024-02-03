import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-screens',
  templateUrl: './screens.component.html',
  styleUrls: ['./screens.component.scss']
})
export class ScreensComponent implements OnInit {
  @Input() device?: string

  constructor() { }

  ngOnInit(): void {
  }

}
