import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { HomeSettingsService } from 'src/app/includes/services/home.settings.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';

import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-view-dashboard-settings',
  templateUrl: './view-dashboard-settings.component.html',
  styleUrls: ['./view-dashboard-settings.component.scss']
})
export class ViewDashboardSettingsComponent implements OnInit {

  appRoute = appRoutes
  dashboardSettingsCount: any = 0
  slug: any
  homeSettings: any;
  positions: any;
  sorted_postions: any = {}
  result: any = []
  newResult: any = []
  isSave: boolean;
  data: any = {
    positions: {
    }
  }
  hoverarray: any = []
  counter: any = 0
  carausel_image: any

  constructor(
    private cdr: ChangeDetectorRef,
    private HomeSettingsService: HomeSettingsService,
    private ToastrService: ToastrService,
    private http: HttpClientModule
  ) { }

  ngOnInit(): void {
    this.HomeSettingsService.getHomeSettings().subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.homeSettings = res?.result
        this.cdr.markForCheck()
      } else {
        this.homeSettings = []
      }
    })

    this.HomeSettingsService.getHomeSettingsCount().subscribe((res: any) => {
      if (res?.result) {
        this.dashboardSettingsCount = res?.result
      } else {
        this.dashboardSettingsCount = 0
      }
      this.cdr.markForCheck()
    })

    this.carauselEvent()
  }

  getId(type: any, title: any, index: any) {
    for (let home of this.homeSettings) {
      if (home.type == type) {
        if (type == 'product' && home?.title?.text == title) {
          this.hoverarray.push(home)
        } else if (type != 'product' && type != 'banner') {
          this.hoverarray.push(home)
        } else if (type == 'banner') {
          if (this.homeSettings.indexOf(home) == index) {
            this.hoverarray.push(this.homeSettings[index])
          }
        }
      }
    }
  }

  removeId() {
    this.hoverarray = []
  }

  carauselEvent() {
    setInterval(() => {
      for (let home of this.homeSettings) {
        if (home['type'] == 'carausel') {
          if ((this.counter + 1) == home['carausel_items'].length) {
            this.carausel_image = home['carausel_items'][this.counter]['image']
            this.counter = 0
          } else {
            this.carausel_image = home['carausel_items'][this.counter]['image']
            this.counter += 1
          }
          this.cdr.markForCheck()
        }
      }
    }, 800)
  }

  drop(event: any) {
    moveItemInArray(this.homeSettings, event.previousIndex, event.currentIndex);
    this.isSave = true
  }

  saveButton() {
    this.data['slug'] = this.slug
    for (let i = 0; i < this.homeSettings.length; i++) {
      console.log(i, this.homeSettings[i]['type']);

      switch (this.homeSettings[i]['type']) {
        case 'carausel':
          this.data['positions']['carausel'] = {
            value: i
          }
          break
        case 'category':
          this.data['positions']['category'] = {
            text: this.homeSettings[i]['title']['text'],
            value: i
          }
          break
        case 'deals-grid':
          this.data['positions']['deals-grid'] = {
            text: this.homeSettings[i]['title']['text'],
            value: i
          }
          break
        case 'banner':
          this.data['positions']['banner'] = {
            value: i
          }
          break
        case 'brand':
          this.data['positions']['brand'] = {
            text: this.homeSettings[i]['title']['text'],
            value: i
          }
          break
        case 'product':
          this.data['positions']['product'] = {
            text: this.homeSettings[i]['title']['text'],
            value: i
          }
          break
        case 'product-grid':
          this.data['positions']['product-grid'] = {
            text: this.homeSettings[i]['title']['text'],
            value: i
          }
          break
      }
    }
    if (this.data) {
      this.HomeSettingsService.updateHomeSettings(this.data).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          document.location.reload()
          this.ToastrService.success(res?.message)
        } else {
          this.ToastrService.error(res?.message)
        }
      })
    }
  }
}
