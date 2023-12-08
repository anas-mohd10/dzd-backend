import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-offers-listing',
  templateUrl: './offers-listing.component.html',
  styleUrls: ['./offers-listing.component.scss']
})
export class OffersListingComponent implements OnInit {
  appRoute = appRoutes
  offers: Array<any> = []
  keyword: FormControl = new FormControl('')
  startDate: FormControl = new FormControl('')
  endDate: FormControl = new FormControl('')
  status: FormControl = new FormControl('')
  page: number = 1
  isLastPage: boolean = false
  limit: number = 20

  constructor() { }

  ngOnInit(): void {
  }

  

}
