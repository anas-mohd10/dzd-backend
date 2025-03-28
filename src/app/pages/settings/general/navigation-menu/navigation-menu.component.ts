import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { appRoutes } from 'src/app/config/routes';
import { AppSettingsService } from 'src/app/includes/services/app.settings.service';
import { CategoryService } from 'src/app/includes/services/category.service';
import { environment } from 'src/environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AdminUsersService } from 'src/app/includes/services/admin.users.service';
import { MenuService } from 'src/app/includes/services/menu.service';
import { HotToastService } from '@ngneat/hot-toast';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { StaticPageService } from 'src/app/includes/services/static-page.service';
import { MegamenuService } from 'src/app/includes/services/megamenu.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FooterService } from 'src/app/includes/services/footer.service';
import { BrandService } from 'src/app/includes/services/brand.service';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ProductService } from 'src/app/includes/services/product.service';

@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.scss'],
})
export class NavigationMenuComponent implements OnInit {
  modalRef?: BsModalRef;
  appRoute = appRoutes;
  categories: Array<any> = [];
  subCategories: Array<any> = [];
  category: FormControl = new FormControl('');
  footerCategory: FormControl = new FormControl('');
  megaMenuCategories: Array<any> = [];
  base: string = environment.base;
  activeCategory: string = '';
  menuType: FormControl = new FormControl('1');
  products: any = [];
  collections: any = [];
  brands: any = [];
  selectedOption: string = '';
  dropdownInputs: Array<any> = [];
  settings: any = {};
  itemForm!: FormGroup;
  @ViewChild('scrollItems') scrollItems: ElementRef = new ElementRef<any>({});
  translateXValue = 0;
  types: Array<any> = [
    {
      key: 'Mega Menu',
      value: '1',
    },
    {
      key: 'Advanced Mega Menu',
      value: '3',
    },
    {
      key: 'Side Menu',
      value: '2',
    },
    {
      key: 'New Mega Menu',
      value: '4',
    },
  ];
  itemTypes: Array<any> = [
    {
      key: 'Category',
      value: 'category',
    },
    {
      key: 'Brand',
      value: 'brand',
    },
    {
      key: 'Product',
      value: 'product',
    },
    {
      key: 'Collection',
      value: 'collection',
    },
    {
      key: 'Search filters',
      value: 'searchfilters',
    },
    {
      key: 'Static Pages',
      value: 'staticpages',
    },
    {
      key: 'CMS Pages',
      value: 'cmspages',
    },
  ];
  cmsPages: Array<any> = [
    { title: 'FAQs', value: '/faqs' },
    { title: 'Stores', value: '/stores' },
    { title: 'Reviews', value: '/reviews' },
    { title: 'Brands', value: '/brands' },
    { title: 'Contact Us', value: '/contact-us' },
    { title: 'About Us', value: '/about' },
    { title: 'Home', value: '/' },
  ];
  staticPages: Array<any> = [];
  isInvalidItem: boolean = false;
  savedItems: Array<any> = [];
  archivedItems: Array<any> = [];
  keyword: FormControl = new FormControl('');
  items: Array<any> = [];
  itemProducts: Array<any> = [];
  selectedItem: any;
  itemDetails: any = {};
  allCategories: Array<any> = [];
  footerCategories: Array<any> = [];
  activeAdvancedMenuItemIndex: any;
  headerText: FormControl = new FormControl('');
  //Footer Details
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Type here',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'Sen', name: 'Sen' },
      { class: 'josefin', name: 'Josefin Sans' },
      { class: 'poppins', name: 'Poppins' },
    ],
  };
  facilityIndex: any = null;
  form: FormGroup = new FormGroup({});
  footerForm: FormGroup = new FormGroup({});
  storeFacilities: Array<{
    name: string;
    description: string;
    icon: string;
  }> = [];
  storeFacilityModal?: BsModalRef;
  storeFacilityForm: FormGroup = new FormGroup({});
  //Footer Details
  advacnedMenuForm: FormGroup = new FormGroup({});
  advancedMenuItemForm: FormGroup = new FormGroup({});
  menuItemForm: FormGroup = new FormGroup({});
  advancedMenuItems: Array<any> = []; //Advanced menu items
  advanedMenuTitleItems: Array<any> = []; //Existing menu items
  advancedTitleRef: BsModalRef;
  advancedTitleItemRef: BsModalRef;
  advancedMenuTitles: Array<any> = [];
  advancedMenuIcon: any;
  advancedAvertisementThumbnail: any;
  isEditTitleRef: boolean = false;
  titleRefDetails: any;
  advancedTitleRefItems: BsModalRef;
  advancedMenuTitleItems: Array<any> = [];
  isAdvancedMenuItemSubmitted: boolean = false;
  isAdvancedMenuItemItemSubmitted: boolean = false;
  megaMenuForm: FormGroup = new FormGroup({});
  megaMenuModalRef?: BsModalRef;
  megaMenuItems: Array<any> = [];
  subMenuBoxForm: FormGroup = new FormGroup({});
  subMenuBoxes: Array<any> = [];
  subMenuBoxIcon: string = '';
  megaMenuDetails: any;
  megaMenuIcon: string = '';
  menuItemDetails: any = {};
  menuItemId: boolean = false;
  megaMenuItemForm: FormGroup = new FormGroup({});
  isMegaMenuItemDetailsSubmitted: boolean = false;
  subMenus: Array<any> = [];
  megaMenuAdvertisement: string = '';
  megaMenuAdvertisementMobile: string = '';
  megaMenuEdit: boolean = false;
  menuItemIcon: string = '';
  megaMenuItemIndex: any;
  subMenuBoxIndex: any = null;
  menuItemsRef: BsModalRef;
  isAddMenuItem: boolean = false;
  childNodeForm: FormGroup = new FormGroup({});
  isAddMenuChildItem: boolean = false;
  childNodes: Array<any> = [];
  isChildNodeSubmitted: boolean = false;
  showProducts: boolean = false;
  childNode: any;
  childNodeDetails: any = {};
  childNodeIcon: string = '';
  childNodeIndex: any = null;
  parentMenuIndex: any = null;
  showChildNode: any = null
  redirectionValue: string = '';
  subMenuIcon: string = '';

  get itemControls() {
    return this.itemForm.controls;
  }

  constructor(
    private CategoryService: CategoryService,
    private ProductService: ProductService,
    private CollectionService: CollectionService,
    private BrandService: BrandService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private ToastrService: ToastrService,
    private AppSettingsService: AppSettingsService,
    private modalService: BsModalService,
    private AdminUsersService: AdminUsersService,
    private MenuService: MenuService,
    private Toast: HotToastService,
    private MegamenuService: MegamenuService,
    private StaticPageService: StaticPageService,
    private FooterService: FooterService,
    private HotToastService: HotToastService,

  ) { }

  product = [{ name: 'Product 1' }, { name: 'Product 2' }];
  collection = [{ name: 'Collection 1' }, { name: 'Collection 2' }];
  brand = [{ name: 'Brand 1' }, { name: 'Brand 2' }];
  categorie = [{ name: 'Category 1' }, { name: 'Category 2' }];

  onRedirectionChange(event: any) {
    const value = event.target.value;
    this.selectedOption = value;
    this.megaMenuForm.get('selectedOption')?.setValue(value);
    
    // Clear the selected item and redirection value
    this.selectedItem = '';
    this.redirectionValue = '';
    this.megaMenuForm.get('redirection')?.setValue('');
    
    // Also reset any specific dropdown controls
    const controlName = `selected${value.charAt(0).toUpperCase() + value.slice(1)}`;
    this.megaMenuForm.get(controlName)?.setValue('');
    
    if (value === 'complete') {
      this.redirectionValue = '/store';
      this.megaMenuForm.get('redirection')?.setValue('/store');
    }
  }
  

  onSelectItem(event: any) {
    const selectedItem = event.target.value;
    this.selectedItem = selectedItem;
    
    if (!this.selectedOption || !selectedItem) {
      this.redirectionValue = '';
      this.megaMenuForm.get('redirection')?.setValue('');
      return;
    }
    
    const controlName = `selected${this.selectedOption.charAt(0).toUpperCase() + this.selectedOption.slice(1)}`;
    this.megaMenuForm.get(controlName)?.setValue(selectedItem);
    
    let pathPrefix;
    switch(this.selectedOption) {
      case 'brands': 
        pathPrefix = 'brands';
        break;
      case 'products':
        pathPrefix = 'products';
        break;
      case 'categories':
        pathPrefix = 'products';
        break;
      case 'collections':
        pathPrefix = 'c';
        break;
      case 'complete':
        pathPrefix = 'store';
        break;
      default:
        pathPrefix = this.selectedOption;
    }
  
    // Convert selectedItem to lowercase and replace spaces with hyphens
    const urlFriendlyItem = selectedItem.toLowerCase().replace(/\s+/g, '-');
    
    this.redirectionValue = this.selectedOption === 'complete' 
      ? `/${pathPrefix}`
      : `/${pathPrefix}/${urlFriendlyItem}`;
      
    this.megaMenuForm.get('redirection')?.setValue(this.redirectionValue);
}
  fetchBrand() {
    this.BrandService.getBrand().subscribe((res: any) => {
      this.brands = res?.result || [];
    });
  }
  
  fetchProduct() {
    this.ProductService.getProducts({}).subscribe((res: any) => {
      this.products = res?.result || [];
    });
  }
  
  fetchCategories() {
    this.CategoryService.getCategories({}, {}).subscribe((res: any) => {
      this.categories = res?.result || [];
    });
  }
  
  fetchCollection() {
    this.CollectionService.getCollection().subscribe((res: any) => {
      this.collections = res?.result || [];
    });
  }
  
  
  openStoreFacilityModal(
    template: TemplateRef<any>,
    facilityDetails?: any,
    index?: number
  ) {
    this.facilityIndex = index;
    this.storeFacilityModal = this.modalService.show(template, {
      ignoreBackdropClick: true,
      class: 'modal-lg modal-dialog-centered',
    });
    this.storeFacilityForm.patchValue(facilityDetails);
  }

  get storeFacilityControls() {
    return this.storeFacilityForm.controls;
  }

  closeStoreFacilityModal() {
    this.storeFacilityModal?.hide();
  }

  onStoreFacilityMedia(event: any) {
    this.storeFacilityForm.patchValue({ icon: event.path });
  }

  saveStoreFacility() {
    if (this.facilityIndex !== null && this.facilityIndex !== undefined) {
      this.storeFacilities[this.facilityIndex] = this.storeFacilityForm.value;
    } else {
      this.storeFacilities.push(this.storeFacilityForm.value);
    }
    this.facilityIndex = null;
    this.storeFacilityForm.reset();
    this.closeStoreFacilityModal();
  }
  // onRedirectionChange(event: Event): void {
  //   const selectElement = event.target as HTMLSelectElement;
  //   this.selectedOption = selectElement.value;
  // }


  removeStoreFacility(index: number) {
    this.storeFacilities.splice(index, 1);
  }

  getFooterDetails() {
    this.FooterService.footerDetails().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.footerForm.patchValue(res?.result);
          this.storeFacilities = res?.result?.storeFacilities || [];
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => { },
    });
  }

  submitFooterDetails() {
    this.footerForm.patchValue({ storeFacilities: this.storeFacilities });
    this.FooterService.manageFooterDetails(this.footerForm.value).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.getFooterDetails();
        } else {
        }
      },
      error: (err: any) => { },
    });
  }

  openMegaMenuModal(template: TemplateRef<any>, type?: string, menuId?: string) {
    this.selectedOption = '';
    this.selectedItem = '';
    this.redirectionValue = '';
    this.megaMenuForm.reset();
    this.subMenus = [];
    this.subMenuBoxes = [];
  
    this.megaMenuModalRef = this.modalService.show(template, {
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered modal-xl',
    });
  
    if (type === 'edit' && menuId) {
      this.megaMenuEdit = true;
      this.MegamenuService.getMegaMenuDetails(menuId).subscribe({
        next: (res: any) => {
          if (res?.errorCode === 0) {
            this.megaMenuDetails = res.result;
            this.loadSavedData(res.result); // Now passing the required argument
          }
        },
        error: (err) => {
          this.Toast.error('Failed to load menu details');
        }
      });
    } else {
      this.megaMenuEdit = false;
      this.loadSavedData(); // Called without argument for new items
    }
  }
  removeSubMenuBox(index: number) {
    this.subMenuBoxes.splice(index, 1);
  }

  editSubMenuBox(index: number) {
    this.subMenuBoxForm.patchValue(this.subMenuBoxes[index]);
    this.subMenuBoxIcon = this.subMenuBoxes[index]?.icon;
    this.subMenuBoxIndex = index;
  }

  closeMegaMenuModal() {
    this.selectedOption = '';
    this.selectedItem = '';
    this.redirectionValue = '';
    this.megaMenuForm.reset();
    this.subMenus = [];
    this.subMenuBoxes = [];
    this.megaMenuDetails = null;
    
    this.megaMenuModalRef?.hide();
  }

  addMenuItem() {
    this.isAddMenuItem = true
  }

  addMenuChildItem(menuIndex: number) {
    this.parentMenuIndex = menuIndex
    this.isAddMenuChildItem = true
  }

  handleMegaMenuMedia(type: string, event: any) {
    if (type === 'advertisement') {
      this.megaMenuAdvertisement = event.path;
      this.megaMenuForm.patchValue({ advertisement: event.path });
    } else if (type == 'icon') {
      this.megaMenuIcon = event.path;
      this.megaMenuForm.patchValue({ icon: event.path });
    }
  }

  handleMenuIcon(type: string, event: any) {
    if (type == 'subMenu') {
      this.subMenuIcon = event.path;
      this.megaMenuItemForm.patchValue({ icon: event.path });
    } else if (type == 'childNode') {
      this.childNodeIcon = event.path;
      this.childNodeForm.patchValue({ icon: event.path });
    }
  }

  removeMenuIcon(type: string) {
    if (type == 'subMenu') {
      this.subMenuIcon = '';
      this.megaMenuItemForm.patchValue({ icon: '' });
    } else if (type == 'childNode') {
      this.childNodeIcon = '';
      this.childNodeForm.patchValue({ icon: '' });
    }
  }

  handleMegaMenuMobileMedia(type: string, event: any) {
    if (type === 'advertisementMobile') {
      this.megaMenuAdvertisementMobile = event.path;
      this.megaMenuForm.patchValue({ advertisementMobile: event.path });
    }
  }

  removeMegaMenuMedia(type: string) {
    if (type === 'advertisement') {
      this.megaMenuAdvertisement = '';
      this.megaMenuForm.patchValue({ advertisement: '' });
    } else if (type == 'icon') {
      this.megaMenuIcon = '';
      this.megaMenuForm.patchValue({ icon: '' });
    }
  }

  removeMegaMenuMediaMobile(type: string) {
    if (type === 'advertisementMobile') {
      this.megaMenuAdvertisementMobile = '';
      this.megaMenuForm.patchValue({ advertisementMobile: '' });
    }
  }

  handleMegaMenuBoxMedia(event: any) {
    this.subMenuBoxIcon = event.path;
    this.subMenuBoxForm.patchValue({ icon: event.path });
  }

  saveSubMenuBox() {
    this.subMenuBoxIcon = '';
    if (this.subMenuBoxIndex != null &&
      (
        this.subMenuBoxForm.get('icon')?.value ||
        this.subMenuBoxForm.get('title')?.value ||
        this.subMenuBoxForm.get('redirection')?.value
      )
    ) {
      this.subMenuBoxes[this.subMenuBoxIndex] = this.subMenuBoxForm.value;
    } else if (
      this.subMenuBoxIndex == null &&
      (
        this.subMenuBoxForm.get('icon')?.value ||
        this.subMenuBoxForm.get('title')?.value ||
        this.subMenuBoxForm.get('redirection')?.value
      )
    ) {
      {
        this.subMenuBoxes.push(this.subMenuBoxForm.value);
      }
      this.subMenuBoxIndex = null;
      this.subMenuBoxForm.reset();
    }
  }

  cancelSubMenuBox() {
    this.subMenuBoxIcon = '';
    this.subMenuBoxIndex = null;
    this.subMenuBoxForm.reset();
  }

  saveMegaMenuItem() {
    if (this.megaMenuForm.invalid) {
      this.megaMenuForm.markAllAsTouched();
      return;
    }
  
    const formData = {
      ...this.megaMenuForm.value,
      icon: this.megaMenuIcon,
      advertisement: this.megaMenuAdvertisement,
      advertisementMobile: this.megaMenuAdvertisementMobile,
      subMenus: this.subMenus,
      subMenuBoxes: {
        title: this.megaMenuForm.value.subMenuBoxes?.title,
        menuBoxes: this.subMenuBoxes
      }
    };
  
    const saveObservable = this.megaMenuEdit
      ? this.MegamenuService.updateMegaMenu({
          _id: this.megaMenuDetails?._id,
          ...formData
        })
      : this.MegamenuService.addMegaMenu({
          index: this.megaMenuItems.length + 1,
          ...formData
        });
  
    saveObservable.subscribe({
      next: (res: any) => {
        if (res?.errorCode === 0) {
          this.Toast.success(res.message);
          this.closeMegaMenuModal();
          this.getMegaMenu();
        } else {
          this.Toast.error(res?.message || 'Failed to save');
        }
      },
      error: (err) => {
        this.Toast.error(err.error?.message || 'Error saving menu item');
      }
    });
  }
  

  get megaMenuItemFormControls() {
    return this.megaMenuItemForm.controls;
  }

  get childNodeFormControls() {
    return this.childNodeForm.controls
  }

  saveMegaMenuItemDetails() {
    if (!this.megaMenuItemForm.valid) {
      this.isMegaMenuItemDetailsSubmitted = true;
      return;
    }

    if (this.megaMenuItemIndex != null) {
      this.subMenus[this.megaMenuItemIndex] = {
        ...this.megaMenuItemForm.value,
        childNodes: this.subMenus[this.megaMenuItemIndex]['childNodes']
      };
      this.Toast.success('Menu item added successfully');
      this.megaMenuItemForm.reset();
      this.isMegaMenuItemDetailsSubmitted = false;
      this.megaMenuItemIndex = null;
    } else {
      this.subMenus.push({ ...this.megaMenuItemForm.value, childNodes: [] });
      this.Toast.success('Menu item added successfully');
      this.megaMenuItemForm.reset();
      this.isMegaMenuItemDetailsSubmitted = false;
    }
    this.isAddMenuItem = false
  }

  saveChildNodeDetails() {
    if (!this.childNodeForm.valid) {
      this.isMegaMenuItemDetailsSubmitted = true;
      return;
    }

    if (this.childNodeIndex != null) {
      this.subMenus[this.parentMenuIndex]['childNodes'][this.childNodeIndex] = this.childNodeForm.value;
      this.Toast.success('Menu item added successfully');
      this.childNodeForm.reset();
      this.isMegaMenuItemDetailsSubmitted = false;
      this.childNodeIndex = null;
    } else {
      this.subMenus[this.parentMenuIndex]['childNodes'].push(this.childNodeForm.value);
      this.Toast.success('Menu item added successfully');
      this.childNodeForm.reset();
      this.isMegaMenuItemDetailsSubmitted = false;
    }
    this.isAddMenuChildItem = false
  }

  removeMegaMenuItem(index: number) {
    this.subMenus.splice(index, 1);
  }

  getMegaMenuItem(index: number) {
    this.megaMenuItemForm.patchValue(this.subMenus[index]);
    this.subMenuIcon = this.subMenus[index]?.icon;
    this.megaMenuItemIndex = index;
    this.isAddMenuItem = true
  }

  getChildNodeItem(index: number, parentMenuIndex: number) {
    this.parentMenuIndex = parentMenuIndex
    this.childNodeForm.patchValue(this.subMenus[this.parentMenuIndex]['childNodes'][index]);
    this.childNodeIcon = this.subMenus[this.parentMenuIndex]['childNodes'][index]?.icon;
    this.childNodeIndex = index;
    this.isAddMenuChildItem = true
  }

  removeChildNodeItem(index: number, parentMenuIndex: number) {
    this.parentMenuIndex = parentMenuIndex
    this.subMenus[this.parentMenuIndex]['childNodes'].splice(index, 1);
  }

  closeMegaMenuItem() {
    this.isAddMenuItem = false
    this.megaMenuItemForm.reset();
    this.megaMenuItemIndex = null
  }

  closeChildNodeItem() {
    this.isAddMenuChildItem = false
    this.childNodeForm.reset();
    this.childNodeIndex = null
  }

  drop(event: any) {
    let items = [...this.savedItems];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.savedItems = [...items];
    this.rearrangeMenuItems();
  }

  rearrangeMenuItems() {
    let items = this.savedItems.map((item: any, index: number) => {
      return { index: index, refid: item.refid };
    });

    this.MenuService.rearrangeMenu({ items: items }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.getItems();
        } else {
          this.Toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
      },
    });
  }

  getTransformStyle() {
    return `transform: translateX(${this.translateXValue}px);`;
  }

  moveItems(direction: 'left' | 'right') {
    const scrollAmount = 600; // Adjust this value as needed

    if (direction === 'left') {
      this.translateXValue -= scrollAmount;
    } else {
      this.translateXValue += scrollAmount;
    }
  }

  handleMegaMenuItemIcon(event: any) {
    this.menuItemForm.get('icon')?.setValue(event?.path);
    this.menuItemIcon = event?.path;
  }

  removeMegaMenuItemIcon() {
    this.menuItemForm.get('icon')?.setValue(null);
    this.menuItemIcon = '';
  }


  onSelect(event: { dropdownInputs: any[] }) {
    this.assignDropdownInputs(event.dropdownInputs);
  }

  assignDropdownInputs(dropdownInputs: any[]) {
    switch (this.selectedOption) {
      case 'products':
        this.products = dropdownInputs;
        break;
      case 'collections':
        this.collections = dropdownInputs;
        break;
      case 'categories':
        this.categories = dropdownInputs;
        break;
      case 'brands':
        this.brands = dropdownInputs;
        break;
    }
  }

  onRemoveSelected(item: any) {
    const isExists = this.dropdownInputs.some((input: any) => input._id === item._id);

    if (isExists) {
      this.dropdownInputs = this.dropdownInputs.filter((input: any) => input._id !== item._id);
    } else {
      this.dropdownInputs.push(item);
    }

    this.assignDropdownInputs(this.dropdownInputs);
  }

  applyCoupon(type: string) {
    switch (type) {
      case 'products':
        this.categories = []
        this.collections = []
        this.brands = []
        break
      case 'collections':
        this.categories = []
        this.products = []
        this.brands = []
        break
      case 'categories':
        this.products = []
        this.collections = []
        this.brands = []
        break
      case 'brands':
        this.products = []
        this.collections = []
        this.categories = []
        break
    }
    this.dropdownInputs = []
    this.form.get('criteriaType')?.setValue(type);
    this.ChangeDetectorRef.markForCheck();
  }
  fetchData() {
    // Fetch products
    this.ProductService.getProducts({}).subscribe((res: any) => {
      this.products = res.result || [];
    });

    // Fetch collections
    this.CollectionService.getCollection().subscribe((res: any) => {
      this.collections = res.result || [];
    });

    // Fetch brands
    this.BrandService.getBrand().subscribe((res: any) => {
      this.brands = res.result || [];
    });

    // Fetch categories
    this.CategoryService.getCategories({}, {}).subscribe((res: any) => {
      this.categories = res.result || [];
    
    });
  }
  fetchProducts() {
    this.ProductService.getProduct().subscribe((res: any) => {

      this.products = res?.result || [];
      this.ChangeDetectorRef.detectChanges();  // Ensure change detection runs
    });
  }
  

  fetchCollections() {
    this.CollectionService.getCollection().subscribe((res: any) => {
      this.collections = res?.result || [];
      this.ChangeDetectorRef.markForCheck();
    });
  }

  fetchBrands() {
    this.BrandService.getBrand().subscribe((res: any) => {
      this.brands = res?.result || [];
      this.ChangeDetectorRef.markForCheck();
    });
  }

  // onRedirectionChange(event: any) {
  //   this.selectedOption = event.target.value;
  // }

  loadSavedData(savedData?: any) {
    this.selectedOption = '';
    this.selectedItem = '';
    this.redirectionValue = '';
  
    if (savedData) {
      this.megaMenuIcon = savedData.icon;
      this.megaMenuAdvertisement = savedData.advertisement;
      this.megaMenuAdvertisementMobile = savedData.advertisementMobile;
  
      this.subMenus = savedData.subMenus || [];
      this.subMenuBoxes = savedData.subMenuBoxes?.menuBoxes || [];
  
      if (savedData.redirection) {
        const redirection = savedData.redirection;
        
        if (redirection.includes('/brands/')) {
          this.selectedOption = 'brands';
          this.selectedItem = redirection.split('/brands/')[1];
        } 
        else if (redirection.includes('/products/')) {
          this.selectedOption = 'products';
          this.selectedItem = redirection.split('/products/')[1];
        }
        else if (redirection.includes('/products/')) {
          this.selectedOption = 'categories';
          this.selectedItem = redirection.split('/products/')[1];
        }
        else if (redirection.includes('/c/')) {
          this.selectedOption = 'collections';
          this.selectedItem = redirection.split('/c/')[1];
        }
        else if (redirection === '/store') {
          this.selectedOption = 'complete';
        }
        
        this.redirectionValue = redirection;
      }
  
      this.megaMenuForm.patchValue({
        ...savedData,
        selectedOption: this.selectedOption,
        selectedBrand: this.selectedOption === 'brands' ? this.selectedItem : '',
        selectedProduct: this.selectedOption === 'products' ? this.selectedItem : '',
        selectedCategory: this.selectedOption === 'categories' ? this.selectedItem : '',
        selectedCollection: this.selectedOption === 'collections' ? this.selectedItem : '',
        redirection: this.redirectionValue
      });
    }
  }

  ngOnInit(): void {
    this.fetchBrands();
    this.fetchProducts();
    this.fetchCategories();
    this.fetchCollections();

    this.loadSavedData();

    this.getMegaMenu();

    this.getFooterDetails();

    this.subMenuBoxForm = new FormGroup({
      title: new FormControl(''),
      icon: new FormControl(''),
      redirection: new FormControl(''),
    });

    this.footerForm = new FormGroup({
      seoContent: new FormControl(''),
      seoContentDisabledFor: new FormControl([]),
      storeFacilities: new FormControl([]),
    });

    this.childNodeForm = new FormGroup({
      icon: new FormControl(''),
      title: new FormControl(''),
      redirection: new FormControl('', Validators.required),
    });

    this.storeFacilityForm = new FormGroup({
      name: new FormControl(''),
      description: new FormControl(''),
      icon: new FormControl(''),
    });

    this.megaMenuItemForm = new FormGroup({
      icon: new FormControl(''),
      title: new FormControl(''),
      redirection: new FormControl('', Validators.required),
    });

this.megaMenuForm = new FormGroup({
  title: new FormControl('', Validators.required),
  icon: new FormControl(''),
  redirection: new FormControl('', Validators.required),
  selectedOption: new FormControl(''),
  selectedBrand: new FormControl(''),
  selectedProduct: new FormControl(''),
  selectedCategory: new FormControl(''),
  selectedCollection: new FormControl(''),
  advertisement: new FormControl(''),
  advertisementRedirection: new FormControl(''),
  subMenuBoxes: new FormGroup({
    title: new FormControl(''),
    menuBoxes: new FormControl([]),
  }),
});

    this.StaticPageService.active().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          res?.result?.forEach((item: any) => {
            this.staticPages.push({
              title: item?.title,
              value: '/' + item?.slug,
            });
          });
        }
      },
    });

    this.getCategories();

    //Advanced menu configurations
    this.advacnedMenuForm = new FormGroup({
      title: new FormControl('', Validators.required),
      icon: new FormControl(null),
      advertisementThumbnail: new FormControl(null),
      advertisementTitle: new FormControl(''),
      advertisementButton: new FormControl(''),
      advertisementDescription: new FormControl(''),
      advertisementRedirection: new FormControl(''),
    });

    this.advancedMenuItemForm = new FormGroup({
      codeSpace: new FormControl('', Validators.required),
      title: new FormControl('', Validators.required),
      menuItems: new FormControl([]),
    });

    this.menuItemForm = new FormGroup({
      icon: new FormControl(''),
      title: new FormControl(''),
      redirection: new FormControl('', Validators.required),
    });

    this.getCsTitles();
    //Advanced menu configurations

    this.CategoryService.getCategories({}, 'mega').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.megaMenuCategories = res?.result;
        this.ChangeDetectorRef.markForCheck();
      }
    });

    this.CategoryService.getCategories({}, 'footer').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.footerCategories = res?.result;
        this.ChangeDetectorRef.markForCheck();
      }
    });

    this.getSettings();

    this.getItems();

    this.getArchivedItems();

    this.getAllCategories();

    this.itemForm = new FormGroup({
      title: new FormControl('', Validators.required),
      menuType: new FormControl('', Validators.required),
      icon: new FormControl(null),
      redirection: new FormControl('', Validators.required),
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered modal-lg',
    });
  }

  openArchivedModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered modal-lg',
    });
    this.getArchivedItems();
  }

  openEditModal(template: TemplateRef<any>, item: any) {
    this.modalRef = this.modalService.show(template, {
      ignoreBackdropClick: true,
      class: 'modal-dialog-centered modal-lg',
    });
    this.MenuService.getMenuDetails(item?.refid).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.itemDetails = res?.result;
        for (let _key of Object.keys(res?.result))
          this.itemForm.get(_key)?.setValue(res?.result[_key]);
        this.itemForm.get('icon')?.setValue(this.itemDetails?.icon?._id);
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  closeModal() {
    this.modalService.hide();
    this.itemForm.reset();
    this.isInvalidItem = false;
  }

  selectMenuType(type: string) {
    this.menuType.setValue(type);
    this.AppSettingsService.updateSettings({
      menuType: this.menuType.value,
      refid: this.settings?.refid,
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.getSettings();
        this.Toast.success('Menu type updated successfully');
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  handleTitleThumbnail(event: any) {
    this.itemForm.get('icon')?.setValue(event?._id);
  }

  removeTitleThumbnail() {
    this.itemForm.get('icon')?.setValue(null);
    this.itemDetails.icon = '';
  }

  getSettings() {
    this.AppSettingsService.getGeneralSettingsbyId('1').subscribe(
      (res: any) => {
        if (res?.errorCode == 0) {
          this.menuType.setValue(res?.result?.menuType);
          this.headerText.setValue(res?.result?.headerText);
          this.settings = res?.result;
          this.ChangeDetectorRef.markForCheck();
        }
      }
    );
  }

  addToMegaCategory(category: any) {
    if (!category?.isMegaMenu) {
      this.CategoryService.updateCategory(category?.slug, {
        catid: category?.catid,
        slug: category?.slug,
        name: category?.name,
        isMegaMenu: true,
      }).subscribe((res: any) => {
        if (res?.errorCode == 0) {
          this.megaMenuCategories.push(category);
          this.ChangeDetectorRef.markForCheck();
          this.getCategories();
        }
      });
    }
  }

  getSubCategories(category: any) {
    this.activeCategory = category?.catid;
    this.CategoryService.getSubCategories({
      'parent.catid': category?.catid,
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.subCategories = res?.result;
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  removeFromMegaCategory(category: any) {
    this.CategoryService.updateCategory(category?.slug, {
      catid: category?.catid,
      slug: category?.slug,
      name: category?.name,
      isMegaMenu: false,
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.megaMenuCategories = this.megaMenuCategories.filter(
          (item) => item?.catid != category?.catid
        );
        this.ChangeDetectorRef.markForCheck();
        this.getCategories();
      }
    });
  }

  manageMegaMenuCategory(parentCategory: any, category: any) {
    let isMegaMenu = false;
    category?.isMegaMenu ? (isMegaMenu = false) : (isMegaMenu = true);
    this.CategoryService.updateCategory(category?.slug, {
      catid: category?.catid,
      slug: category?.slug,
      name: category?.name,
      isMegaMenu: isMegaMenu,
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.ChangeDetectorRef.markForCheck();
        this.getSubCategories(parentCategory);
      }
    });
  }

  getCategories() {
    this.CategoryService.searchCategory({
      keyword: this.category.value,
      limit: 30,
      page: 1,
      isRoot: 'true',
      isMegaMenu: 'false',
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.categories = res?.result?.data;
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  selectItemType(type: string) {
    this.itemForm.get('menuType')?.setValue(type);
    this.itemForm.get('redirection')?.setValue('');
  }

  setSearchFilters() {
    this.itemForm.get('redirection')?.setValue(this.keyword.value);
  }

  selectItemCard(item: any) {
    this.selectedItem = item;
    this.itemForm.get('redirection')?.setValue(item?.slug);
    this.items = [];
    this.itemProducts = [];
    this.keyword?.setValue('');
  }

  removeItem() {
    this.selectedItem = null;
    this.itemForm.get('redirection')?.setValue('');
  }

  searchItems() {
    if (this.keyword.value) {
      switch (this.itemForm.get('menuType')?.value) {
        case 'category':
          this.AdminUsersService.generalSearch(
            { keyword: this.keyword.value, page: 1, limit: 30 },
            'category'
          ).subscribe((res: any) => {
            if (res?.errorCode == 0) {
              this.items = res?.result?.data;
              this.ChangeDetectorRef.markForCheck();
            }
          });
          break;
        case 'brand':
          this.AdminUsersService.generalSearch(
            { keyword: this.keyword.value, page: 1, limit: 30 },
            'brand'
          ).subscribe((res: any) => {
            if (res?.errorCode == 0) {
              this.items = res?.result?.data;
              this.ChangeDetectorRef.markForCheck();
            }
          });
          break;
        case 'collection':
          this.AdminUsersService.generalSearch(
            { keyword: this.keyword.value, page: 1, limit: 30 },
            'c'
          ).subscribe((res: any) => {
            if (res?.errorCode == 0) {
              this.items = res?.result?.data;
              this.ChangeDetectorRef.markForCheck();
            }
          });
          break;
        case 'product':
          this.AdminUsersService.generalSearch(
            { keyword: this.keyword.value, page: 1, limit: 30 },
            'p'
          ).subscribe((res: any) => {
            if (res?.errorCode == 0) {
              this.items = res?.result?.data;
              this.ChangeDetectorRef.markForCheck();
            }
          });
          break;
        case 'staticpages':
          this.itemForm.get('keyword')?.setValue('');
          this.itemForm.get('redirection')?.setValue(this.keyword.value);
          break;
      }
    }
  }

  getItems() {
    this.MenuService.getMenuItems('active').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.savedItems = res?.result;
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  getArchivedItems() {
    this.MenuService.getMenuItems('inactive').subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.archivedItems = res?.result;
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  manageItem(type: any) {
    switch (type) {
      case 'add':
        if (!this.itemForm.valid) {
          this.isInvalidItem = true;
          return;
        }

        this.MenuService.addMenu(this.itemForm.value).subscribe((res: any) => {
          if (res?.errorCode == 0) {
            this.closeModal();
            this.Toast.success(res?.message);
            this.getItems();
            this.ChangeDetectorRef.markForCheck();
          } else {
            this.Toast.error(res?.message);
          }
        });
        break;
      case 'update':
        if (!this.itemForm.valid) {
          this.isInvalidItem = true;
          return;
        }

        this.MenuService.updateMenu({
          ...this.itemForm.value,
          refid: this.itemDetails?.refid,
        }).subscribe((res: any) => {
          if (res?.errorCode == 0) {
            this.closeModal();
            this.Toast.success(res?.message);
            this.getItems();
            this.ChangeDetectorRef.markForCheck();
          } else {
            this.Toast.error(res?.message);
          }
        });
        break;
    }
  }

  deleteItem(item: any) {
    item.isDelete = true;
    this.MenuService.updateMenu(item).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.closeModal();
        this.getItems();
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  archiveItem() {
    this.MenuService.updateMenu({
      ...this.itemForm.value,
      refid: this.itemDetails?.refid,
      isActive: false,
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.closeModal();
        this.getItems();
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  unarchiveItem(item: any) {
    item.isActive = true;
    this.MenuService.updateMenu(item).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.closeModal();
        this.getItems();
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  getAllCategories() {
    this.CategoryService.searchCategory({
      keyword: this.footerCategory.value,
      limit: 30,
      page: 1,
      isActive: 'true',
      isFooter: 'false',
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.allCategories = res?.result?.data;
        this.ChangeDetectorRef.markForCheck();
      }
    });
  }

  addCategoryToFooter(category: any) {
    this.CategoryService.updateCategory(category?.slug, {
      catid: category?.catid,
      slug: category?.slug,
      _id: category?._id,
      name: category?.name,
      isFooter: true,
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.footerCategories.push(category);
        this.ChangeDetectorRef.markForCheck();
        this.getAllCategories();
      }
    });
  }

  removeCategoryFromFooter(category: any) {
    this.CategoryService.updateCategory(category?.slug, {
      catid: category?.catid,
      slug: category?.slug,
      _id: category?._id,
      name: category?.name,
      isFooter: false,
    }).subscribe((res: any) => {
      if (res?.errorCode == 0) {
        this.footerCategories = this.footerCategories.filter(
          (item: any) => item?.catid != category?.catid
        );
        this.ChangeDetectorRef.markForCheck();
        this.getAllCategories();
      }
    });
  }

  saveText() {
    this.AppSettingsService.updateSettings({
      headerText: this.headerText.value,
    }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
        } else {
          this.Toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
      },
      complete: () => {
        this.getSettings();
        this.ChangeDetectorRef.markForCheck();
      },
    });
  }

  //Advanced menu items
  handleAdvertisementThumbnail(event: any) {
    this.advacnedMenuForm.get('advertisementThumbnail')?.setValue(event?._id);
  }

  handleTitleRefThumbnail(event: any) {
    this.advacnedMenuForm.get('icon')?.setValue(event?._id);
  }

  openTitleRef(template: TemplateRef<any>, type?: string, id?: string) {
    this.advancedTitleRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      ignoreBackdropClick: true,
    });
    if (type == 'update') {
      this.isEditTitleRef = true;
      this.MenuService.getCsTitleDetails(id).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.titleRefDetails = res?.result;
            this.advacnedMenuForm.patchValue(res?.result);
            if (res?.result?.icon)
              this.advancedMenuIcon = res?.result?.icon?.path;
            if (res?.result?.advertisementThumbnail)
              this.advancedAvertisementThumbnail =
                res?.result?.advertisementThumbnail?.path;
            this.ChangeDetectorRef.markForCheck();
          } else {
          }
        },
        error: (err: any) => { },
      });
    }
  }

  closeTitleRef() {
    this.advancedTitleRef?.hide();
    this.advacnedMenuForm.reset();
    this.isEditTitleRef = false;
  }

  removeTitleMedia(type: string) {
    if (type == 'icon') {
      this.advacnedMenuForm.get('icon')?.reset();
      this.advancedMenuIcon = '';
    } else if (type == 'thumbnail') {
      this.advacnedMenuForm.get('advertisementThumbnail')?.reset();
      this.advancedAvertisementThumbnail = '';
    }
  }

  openTitleItemsRef(template: TemplateRef<any>, menuItemId?: string) {
    this.closeTitleRef();
    this.advancedMenuItemForm.patchValue({
      codeSpace: this.titleRefDetails?._id,
    });
    this.advancedTitleItemRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      ignoreBackdropClick: true,
    });

    if (menuItemId) {
      this.menuItemId = true;
      this.MenuService.getCsTitleItemDetails(menuItemId).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.advancedMenuItemForm.patchValue(res?.result);
            this.advancedMenuItems = res?.result?.menuItems;
            this.menuItemDetails = res?.result;
            this.ChangeDetectorRef.markForCheck();
          } else {
          }
        },
        error: (err: any) => { },
      });
    }
  }

  get menuItemFormControls() {
    return this.menuItemForm.controls;
  }

  get advancedMenuItemFormControls() {
    return this.advancedMenuItemForm.controls;
  }

  removeAdvancedMenuItem(index: number) {
    this.advancedMenuItems = this.advancedMenuItems.filter(
      (item, i) => i != index
    );
  }

  editAdvancedMenuItem(index: number) {
    this.activeAdvancedMenuItemIndex = index;
    this.menuItemIcon = this.advancedMenuItems[index]?.icon;
    this.menuItemForm.patchValue(this.advancedMenuItems[index]);
  }

  closeTitleItemsRef() {
    this.advancedTitleItemRef?.hide();
    this.menuItemId = false;
    this.advancedMenuItemForm.reset();
    this.menuItemDetails = {};
    this.advancedMenuItems = [];
    this.isAdvancedMenuItemSubmitted = false;
    this.childNodeIndex = null
    this.megaMenuIcon = ''
    this.subMenuIcon = ''
    this.childNodeIcon = ''
    this.megaMenuItemIndex = null
    this.isAddMenuChildItem = false
    this.isAddMenuItem = false
  }

  saveTitleItemsRef() {
    if (!this.advancedMenuItemForm.valid) {
      this.isAdvancedMenuItemSubmitted = true;
      return;
    }

    this.advancedMenuItemForm.patchValue({ menuItems: this.advancedMenuItems });
    if (this.menuItemId) {
      this.MenuService.updateCsTitleItems({
        _id: this.menuItemDetails?._id,
        ...this.advancedMenuItemForm.value,
      }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.Toast.success(res?.message);
            this.getCsTitles();
            this.advancedMenuItemForm.reset();
            this.closeTitleItemsRef();
          } else {
          }
        },
        error: (err: any) => { },
      });
    } else {
      this.MenuService.createCsTitleItems({
        ...this.advancedMenuItemForm.value,
      }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.Toast.success(res?.message);
            this.getCsTitles();
            this.advancedMenuItemForm.reset();
            this.closeTitleItemsRef();
          } else {
          }
        },
        error: (err: any) => { },
      });
    }
  }

  onSubmitMenuItem() {
    if (!this.menuItemForm.valid) {
      this.isAdvancedMenuItemItemSubmitted = true;
      return;
    }

    if (this.activeAdvancedMenuItemIndex != null) {
      this.advancedMenuItems[this.activeAdvancedMenuItemIndex] =
        this.menuItemForm.value;
      this.activeAdvancedMenuItemIndex = null;
    } else {
      this.advancedMenuItems = [
        ...this.advancedMenuItems,
        this.menuItemForm.value,
      ];
      this.activeAdvancedMenuItemIndex = null;
    }

    this.menuItemForm.reset();
    this.menuItemIcon = '';
  }

  onSubmitTitleRef() {
    if (this.isEditTitleRef) {
      this.MenuService.updateCsTitle({
        _id: this.titleRefDetails?._id,
        ...this.advacnedMenuForm.value,
      }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.Toast.success(res?.message);
            this.getCsTitles();
            this.closeTitleRef();
          } else {
          }
        },
        error: (err: any) => { },
      });
    } else {
      this.MenuService.createCsTitle(this.advacnedMenuForm.value).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.Toast.success(res?.message);
            this.getCsTitles();
            this.closeTitleRef();
          } else {
          }
        },
        error: (err: any) => { },
      });
    }
  }

  onSubmitTitleItemRef() {
    if (this.isEditTitleRef) {
      this.MenuService.updateCsTitleItems({
        _id: this.titleRefDetails?._id,
        ...this.advacnedMenuForm.value,
      }).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.Toast.success(res?.message);
            this.getCsTitles();
            this.closeTitleRef();
          } else {
          }
        },
        error: (err: any) => { },
      });
    } else {
      this.MenuService.createCsTitleItems(
        this.advacnedMenuForm.value
      ).subscribe({
        next: (res: any) => {
          if (res?.errorCode == 0) {
            this.Toast.success(res?.message);
            this.getCsTitles();
            this.closeTitleRef();
          } else {
          }
        },
        error: (err: any) => { },
      });
    }
  }

  onDeleteTitleRef(id: string) {
    this.MenuService.deleteCsTitle(id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.getCsTitles();
        } else {
        }
      },
      error: (err: any) => { },
    });
  }

  onDeleteTitleItemRef() {
    this.MenuService.deleteCsTitleItems(this.menuItemDetails?._id).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.getCsTitles();
          this.closeTitleItemsRef();
        } else {
        }
      },
      error: (err: any) => { },
    });
  }

  getCsTitles() {
    this.MenuService.getCsTitles().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.advancedMenuTitles = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => { },
    });
  }

  dropTitles(event: any) {
    let items = [...this.advancedMenuTitles];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.advancedMenuTitles = [...items];
    this.rearrangeMenuTitles();
  }

  dropMegaMenu(event: any) {
    let items = [...this.megaMenuItems];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.megaMenuItems = [...items];
    this.rearrangeMegaMenu();
  }

  rearrangeMegaMenu() {
    let items = this.megaMenuItems.map((item: any, index: number) => {
      return { index: index, _id: item?._id };
    });

    this.MegamenuService.rearrangeMegaMenu({ items: items }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getMegaMenu();
          this.ChangeDetectorRef.markForCheck();
          this.Toast.success(res?.message);
        } else {
          this.Toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
      },
    });
  }

  getMegaMenu() {
    this.MegamenuService.getMegaMenuItems().subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.megaMenuItems = res?.result;
          this.ChangeDetectorRef.markForCheck();
        } else {
        }
      },
      error: (err: any) => { },
    });
  }

  deleteMegaMenuItem(menuId: string) {
    this.MegamenuService.deleteMegaMenu(menuId).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.getMegaMenu();
        }
      },
    });
  }

  dropTitleItems(event: any) {
    let items = [...this.advancedMenuTitleItems];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.advancedMenuTitleItems = [...items];
    this.rearrangeMenuTitleItems();
  }

  rearrangeMenuTitleItems() {
    let items = this.advancedMenuTitles.map((item: any, index: number) => {
      return { index: index, _id: item?._id };
    });

    this.MenuService.rearrangeCsTitleItems({ items: items }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.getCsTitles();
        } else {
          this.Toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
      },
    });
  }

  rearrangeMenuTitles() {
    let items = this.advancedMenuTitles.map((item: any, index: number) => {
      return { index: index, _id: item?._id };
    });

    this.MenuService.rearrangeCsTitles({ items: items }).subscribe({
      next: (res: any) => {
        if (res?.errorCode == 0) {
          this.Toast.success(res?.message);
          this.getCsTitles();
        } else {
          this.Toast.error(res?.message);
        }
      },
      error: (err: any) => {
        this.Toast.error(err?.error?.message);
      },
    });

  }

  //Advanced menu items
}
