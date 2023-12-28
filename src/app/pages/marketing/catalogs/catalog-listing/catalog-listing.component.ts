import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-catalog-listing',
  templateUrl: './catalog-listing.component.html',
  styleUrls: ['./catalog-listing.component.scss']
})
export class CatalogListingComponent implements OnInit {
  appRoute = appRoutes
  totalResults: number = 0
  totalPages: number = 1
  isLastPage: boolean = true
  catalogs: Array<any> = []
  keyword: FormControl = new FormControl('')
  limit: FormControl = new FormControl('20')
  date: FormControl = new FormControl('')
  page: number = 1

  constructor() { }

  ngOnInit(): void {

  }

  next() {
    this.page++
    this.getCatalogs()
  }

  previous() {
    this.page--
    this.getCatalogs()
  }

  clear() {
    this.keyword.setValue('')
    this.date.setValue('')
    this.page = 1
    this.getCatalogs()
  }

  getCatalogs() {

  }

}
