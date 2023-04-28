import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bulk-options',
  templateUrl: './bulk-options.component.html',
  styleUrls: ['./bulk-options.component.scss']
})
export class BulkOptionsComponent implements OnInit {
  history: any = []
  constructor() { }

  ngOnInit(): void {
  }

}
