import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Form, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss']
})
export class NavigationMenuComponent implements OnInit {
  appRoute = appRoutes
  categories: Array<any> = []
  subCategories: Array<any> = []
  category: FormControl = new FormControl('')
  megaMenuCategories: Array<any> = []
  base: string = environment.base
  activeCategory: string = ''
  menuType: FormControl = new FormControl('1')
  settings: any = {}
  types: Array<any> = [{
    key: 'Mega Menu',
    value: '1'
  }, {
    key: 'Side Menu',
    value: '2'
  }]

  constructor(
    private CategoryService: CategoryService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private AppSettingsService: AppSettingsService
  ) { }

  ngOnInit(): void {
    this.getCategories()

    this.CategoryService.getCategories({}, 'mega').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.megaMenuCategories = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })

    this.getSettings()
  }

  selectMenuType(type: string) {
    this.menuType.setValue(type)
    this.AppSettingsService.updateSettings({ menuType: this.menuType.value, refid: this.settings?.refid }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.getSettings()
      }
    })
  }

  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.menuType.setValue(res?.result?.menuType)
        this.settings = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  addToMegaCategory(category: any) {
    if (!category?.isMegaMenu) {
      this.CategoryService.updateCategory(category?.slug, {
        catid: category?.catid,
        name: category?.name,
        isMegaMenu: true
      }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.megaMenuCategories.push(category)
          this.ChangeDetectorRef.markForCheck()
          this.getCategories()
        }
      })
    }
  }

  getSubCategories(category: any) {
    this.activeCategory = category?.catid
    this.CategoryService.getSubCategories({ 'parent.catid': category?.catid }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.subCategories = res?.result
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

  removeFromMegaCategory(category: any) {
    this.CategoryService.updateCategory(category?.slug, {
      catid: category?.catid,
      name: category?.name,
      isMegaMenu: false
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.megaMenuCategories = this.megaMenuCategories.filter(item => item?.catid != category?.catid)
        this.ChangeDetectorRef.markForCheck()
        this.getCategories()
      }
    })
  }

  manageMegaMenuCategory(parentCategory: any, category: any) {
    let isMegaMenu = false
    category?.isMegaMenu ? isMegaMenu = false : isMegaMenu = true
    this.CategoryService.updateCategory(category?.slug, {
      catid: category?.catid,
      name: category?.name,
      isMegaMenu: isMegaMenu
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ChangeDetectorRef.markForCheck()
        this.getSubCategories(parentCategory)
      }
    })
  }

  getCategories() {
    this.CategoryService.searchCategory({
      keyword: this.category.value,
      limit: 30,
      page: 1,
      isRoot: 'true',
      isMegaMenu: 'false'
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result?.data
        this.ChangeDetectorRef.markForCheck()
      }
    })
  }

}
