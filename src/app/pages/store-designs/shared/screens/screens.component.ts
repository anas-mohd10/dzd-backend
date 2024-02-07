import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-screens',
  templateUrl: './screens.component.html',
  styleUrls: ['./screens.component.scss']
})
export class ScreensComponent implements OnInit {
  @Input() device?: string;
  @ViewChild("frame") frame: ElementRef | undefined;

  constructor() { }

  ngOnInit(): void {
  }

  reloadFrame() {
    this.frame?.nativeElement.contentWindow?.location.reload();
  }
}
