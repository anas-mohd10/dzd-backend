import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CatalogService } from 'src/app/includes/services/catalog.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { MenuNavigationService } from 'src/app/includes/services/menu-navigation.service';
import { StaticPageService } from 'src/app/includes/services/static-page.service';
import { BlogService } from 'src/app/includes/services/blog.service';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';

interface MenuNavigation {
  _id: string
  device: string
  index: number
  menuType: string
  title: string
  icon: string
  redirection: string
  createdAt: string
  menuItems: MenuNavigation[]
  isExpanded?: boolean
  displayIndex?: string
}

@Component({
  selector: 'app-menu-navigation',
  templateUrl: './menu-navigation.component.html',
  styleUrls: ['./menu-navigation.component.scss']
})
export class MenuNavigationComponent implements OnInit {
  modalRef?: BsModalRef
  copyModalRef?: BsModalRef
  deviceType: FormControl = new FormControl('web')
  menuType: FormControl = new FormControl('')
  menuTypes: Array<{ label: string, value: string }> = [
    { label: "Categories", value: "categories" },
    { label: "Brands", value: "brands" },
    { label: "Products", value: "products" },
    { label: "Collections", value: "collections" },
    { label: "Catalogs", value: "catalogs" },
    { label: "Pages", value: "pages" },
    { label: "Blogs", value: "blogs" },
    { label: "Custom", value: "custom" },
  ]
  parentId: FormControl = new FormControl('')
  devices: string[] = ['web', 'mobile']
  menuNavigations: MenuNavigation[] = []
  form: FormGroup = new FormGroup({})
  activeMenuId: string = ''
  appRoute = appRoutes
  brands: Array<{ name: string, slug: string }> = []
  selectedBrand: string = ''
  categories: Array<{ name: string, slug: string }> = []
  selectedCategory: string = ''
  catalogs: Array<{ title: string, slug: string }> = []
  selectedCatalog: string = ''
  pages: Array<{ title: string, slug: string }> = []
  selectedPage: string = ''
  blogs: Array<{ title: string, slug: string }> = []
  selectedBlog: string = ''
  collections: Array<{ name: string, slug: string }> = []
  selectedCollection: string = ''
  isEditMode: boolean = false
  base: string = environment.base

  constructor(
    private BsModalService: BsModalService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private BrandService: BrandService,
    private CategoryService: CategoryService,
    private MenuNavigationService: MenuNavigationService,
    private HotToastService: HotToastService,
    private CatalogService: CatalogService,
    private StaticPageService: StaticPageService,
    private BlogService: BlogService,
    private CollectionService: CollectionService
  ) { }

  open(template: TemplateRef<any>, menuNavigationId?: string, type?: string) {
    if (menuNavigationId && !type) {
      this.activeMenuId = menuNavigationId
      this.isEditMode = true
      this.getMenuDoc()
    }

    if (type == 'addMore') {
      this.form.patchValue({ parentId: menuNavigationId })
    }

    this.modalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: true })
  }

  close() {
    this.modalRef?.hide()
    this.form.patchValue({ parentId: null, device: this.deviceType.value, menuType: '', title: '', icon: '', redirection: '', index: '' })
    this.resetMenuType()
    this.isEditMode = false
  }

  resetMenuType() {
    this.menuType.setValue('')
    this.selectedBrand = ''
    this.selectedCategory = ''
    this.selectedCatalog = ''
    this.selectedPage = ''
    this.selectedBlog = ''
    this.selectedCollection = ''
  }

  openCopy(template: TemplateRef<any>) {
    this.copyModalRef = this.BsModalService.show(template, { class: 'modal-sm modal-dialog-centered', ignoreBackdropClick: false })
  }

  confirmCopy() {
    this.MenuNavigationService.copyMenuNavigations().subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.fetchMenuDocs()
          this.copyModalRef?.hide()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

  closeCopy() {
    this.copyModalRef?.hide()
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      parentId: new FormControl(null),
      device: new FormControl(''),
      menuType: new FormControl(''),
      title: new FormControl(''),
      icon: new FormControl(''),
      redirection: new FormControl('', Validators.required),
      index: new FormControl(''),
    })

    // Set the device type to the form
    this.form.patchValue({ device: this.deviceType.value })

    this.fetchMenuDocs()
  }

  onMenuTypeChange(type?: string) {
    const typeToMethodMap: { [key: string]: keyof MenuNavigationComponent } = {
      'brands': 'getBrands',
      'categories': 'getCategories',
      'catalogs': 'getCatalogs',
      'pages': 'getPages',
      'blogs': 'getBlogs',
      'collections': 'getCollections'
    };

    const method = typeToMethodMap[this.form.value.menuType];
    if (method) {
      (this as any)[method]();
    }

    if (type) {
      return;
    }

    this.form.patchValue({
      title: '',
      redirection: '',
      icon: ''
    });
  }

  handleMenuIcon(icon: { path: string }) {
    this.form.patchValue({ icon: icon.path })
  }

  onRemoveIcon() {
    this.form.patchValue({ icon: '' })
  }

  onDeviceTypeChange() {
    this.form.patchValue({ device: this.deviceType.value })
    this.fetchMenuDocs()
  }

  fetchMenuDocs() {
    this.MenuNavigationService.getMenuNavigations(this.deviceType.value).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.menuNavigations = res.result
          this.ChangeDetectorRef.markForCheck()
        } else { }
      }, error: (err: any) => {
        console.log(err)
      }
    })
  }

  getMenuDoc() {
    this.MenuNavigationService.getMenuNavigation(this.activeMenuId).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.form.patchValue({ ...res.result })

          this.onMenuTypeChange('update')
          this.onFetchMenuType()
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {
        console.log(err)
      }
    })
  }

  onFetchMenuType() {
    const typeToPropertyMap: { [key: string]: keyof MenuNavigationComponent } = {
      'brands': 'selectedBrand',
      'categories': 'selectedCategory',
      'catalogs': 'selectedCatalog',
      'pages': 'selectedPage',
      'blogs': 'selectedBlog',
      'collections': 'selectedCollection'
    };

    const menuType = this.form.value.menuType;
    const property = typeToPropertyMap[menuType];
    if (property) {
      (this as any)[property] = this.form.value.redirection.split('/')[2];
    }
  }

  saveChanges() {
    if (this.form.invalid) {
      this.HotToastService.error('Please fill all the required fields')
      return
    }

    if (this.isEditMode) {
      this.MenuNavigationService.updateMenuNavigation(this.activeMenuId, this.form.value).subscribe({
        next: (res: any) => {
          if (res.errorCode == 0) {
            this.close()
            this.fetchMenuDocs()
            this.HotToastService.success(res?.message)
          } else {
            this.HotToastService.error(res?.message)
          }
        }, error: (err: any) => {
          this.HotToastService.error(err?.message)
        }
      })
    } else {
      this.MenuNavigationService.createMenuNavigation({ ...this.form.value, index: this.menuNavigations.length + 1 }).subscribe({
        next: (res: any) => {
          if (res.errorCode == 0) {
            this.close()
            this.fetchMenuDocs()
            this.HotToastService.success(res?.message)
          } else {
            this.HotToastService.error(res?.message)
          }
        }, error: (err: any) => {
          this.HotToastService.error(err?.message)
        }
      })
    }
  }

  deleteMenuNavigation(menuNavigationId?: string) {
    this.MenuNavigationService.deleteMenuNavigation(menuNavigationId ? menuNavigationId : this.activeMenuId).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.close()
          this.fetchMenuDocs()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

  getBrands() {
    this.BrandService.getActiveBrands().subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.brands = res.result
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {
        console.log(err)
      }
    })
  }

  onRedirectionApplied(type: string) {
    switch (type) {
      case 'brands':
        const brandsMap: { [key: string]: string } = {}
        this.brands.forEach((brand: any) => {
          brandsMap[brand.slug] = brand.name
        })

        this.form.patchValue({ title: brandsMap[this.selectedBrand], redirection: `/brands/${this.selectedBrand}` })
        break
      case 'categories':
        const categoriesMap: { [key: string]: string } = {}
        this.categories.forEach((category: any) => {
          categoriesMap[category.slug] = category.name
        })

        this.form.patchValue({ title: categoriesMap[this.selectedCategory], redirection: `/products/${this.selectedCategory}` })
        break
      case 'catalogs':
        const catalogsMap: { [key: string]: string } = {}
        this.catalogs.forEach((catalog: any) => {
          catalogsMap[catalog.slug] = catalog.title
        })

        this.form.patchValue({ title: catalogsMap[this.selectedCatalog], redirection: `/catalogs/${this.selectedCatalog}` })
        break
      case 'pages':
        const pagesMap: { [key: string]: string } = {}
        this.pages.forEach((page: any) => {
          pagesMap[page.slug] = page.title
        })

        this.form.patchValue({ title: pagesMap[this.selectedPage], redirection: `/pages/${this.selectedPage}` })
        break
      case 'blogs':
        const blogsMap: { [key: string]: string } = {}
        this.blogs.forEach((blog: any) => {
          blogsMap[blog.slug] = blog.title
        })

        this.form.patchValue({ title: blogsMap[this.selectedBlog], redirection: `/blogs/${this.selectedBlog}` })
        break
      case 'collections':
        const collectionsMap: { [key: string]: string } = {}
        this.collections.forEach((collection: any) => {
          collectionsMap[collection.slug] = collection.name
        })

        this.form.patchValue({ title: collectionsMap[this.selectedCollection], redirection: `/c/${this.selectedCollection}` })
        break
    }
  }

  getCategories() {
    this.CategoryService.getActiveCategory().subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.categories = res.result
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {
        console.log(err)
      }
    })
  }

  getCatalogs() {
    this.CatalogService.getCatalogs().subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.catalogs = res.result
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {
        console.log(err)
      }
    })
  }

  getPages() {
    this.StaticPageService.active().subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.pages = res.result
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {
        console.log(err)
      }
    })
  }

  getBlogs() {
    this.BlogService.activeBlogs().subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.blogs = res.result
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {
        console.log(err)
      }
    })
  }

  getCollections() {
    this.CollectionService.getActiveCollection().subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.collections = res.result
          this.ChangeDetectorRef.markForCheck()
        }
      }, error: (err: any) => {
        console.log(err)
      }
    })
  }

  //Re-arrange the menu navigation items
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.menuNavigations, event.previousIndex, event.currentIndex);
    this.reorderMenuNavigations()
    this.ChangeDetectorRef.markForCheck();
  }

  reorderMenuNavigations() {
    let menuNavigations = this.menuNavigations.map((menuNavigation, index) => {
      return {
        _id: menuNavigation._id,
        index: index + 1
      }
    })

    this.MenuNavigationService.reorderMenuNavigations({ menuNavigations }).subscribe({
      next: (res: any) => {
        if (res.errorCode == 0) {
          this.fetchMenuDocs()
          this.HotToastService.success(res?.message)
        } else {
          this.HotToastService.error(res?.message)
        }
      }, error: (err: any) => {
        this.HotToastService.error(err?.message)
      }
    })
  }

  toggleAccordion(menuItem: MenuNavigation) {
    menuItem.isExpanded = !menuItem.isExpanded;
  }
}
