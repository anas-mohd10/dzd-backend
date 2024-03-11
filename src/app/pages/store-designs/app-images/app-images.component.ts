import { Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-app-images',
  templateUrl: './app-images.component.html',
  styleUrls: ['./app-images.component.scss']
})
export class AppImagesComponent implements OnInit {
  appRoute = appRoutes;

  constructor() { }

  ngOnInit(): void {
  }

}
