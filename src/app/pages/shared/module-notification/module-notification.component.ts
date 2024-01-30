import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-module-notification',
  templateUrl: './module-notification.component.html',
  styleUrls: ['./module-notification.component.scss']
})
export class ModuleNotificationComponent implements OnInit {
  modalRef?: BsModalRef;
  @Input() type: string;
  
  constructor() { }

  ngOnInit(): void {
  }
}
