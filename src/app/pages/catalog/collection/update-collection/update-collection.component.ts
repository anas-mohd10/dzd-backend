import { Component, OnInit } from '@angular/core';
import { PageTasks } from '../../../../config/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { appRoutes } from '../../../../config/routes';
import { CollectionService } from 'src/app/includes/services/collection.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/includes/services/product.service';

@Component({
  selector: 'app-update-collection',
  templateUrl: './update-collection.component.html',
  styleUrls: ['./update-collection.component.scss'],
})
export class UpdateCollectionComponent implements OnInit {
  collectionForm: FormGroup;
  task = PageTasks.UPDATE;

  editMode = false;
  fileData: any;
  appRoute = appRoutes
  collectionData: any;
  collection: any;
  collectionName: any;
  products: any;
  valueArray: any = [];

  constructor(
    private collectionService: CollectionService,
    private productService: ProductService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.collection = this.route.snapshot.queryParams.collection || '';
    this.getCollection();
    this.getProduct()
    this.managePage()
    this.initForm()
  }

  initForm() {
    this.collectionForm = this.formBuilder.group({
      name: [ '', Validators.required],
      products: ['', Validators.required],
      isFeatured: ['false', Validators.required],
      isActive: ['true', Validators.required],
    });
  }

  managePage() {
    switch (this.task) {
      case PageTasks.ADD:
        this.editMode = false;
        break;
      case PageTasks.UPDATE:
        this.editMode = true;
        break;
      default:
        break;
    }
  }

  getProduct() {
    this.productService.getProduct().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.products = res?.result;
          for(let i=0; i<this.products.length; i++){
            this.collectionForm.get('products')?.setValue(this.products[i].name)
          }
          break;
      }
    });
  }

  getCollection() {
    this.collectionService.getCollectionBySlug(this.collection).subscribe((res:any)=>{
      switch(res?.errorCode){
        case 0:
          console.log(res?.result[0])
          this.collectionData = res?.result[0]
          this.collectionForm.get("name")?.setValue(this.collectionData?.name)
          this.collectionForm.get("isFeatured")?.setValue(this.collectionData?.isFeatured)
          this.collectionForm.get("isActive")?.setValue(this.collectionData?.isActive)
          this.valueArray = this.collectionData?.products
          break
      }
    })
  }

  tagRemove(value: any){

  }

  onSubmit(){}
}
