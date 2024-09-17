import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { appRoutes } from 'src/app/config/routes';

@Component({
  selector: 'app-create-products',
  templateUrl: './create-products.component.html',
  styleUrls: ['./create-products.component.scss']
})
export class CreateProductsComponent implements OnInit {
  appRoute = appRoutes;
  tabIndex: number = 1
  form: FormGroup = new FormGroup({})
  modalRef?: BsModalRef
  taxItems: Array<any> = []
  files: Array<any> = []
  tagIcons: Array<any> = []
  productIcons: Array<any> = []
  
  constructor(
    private BsModalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      sku: new FormControl('', Validators.required),
      stock: new FormControl('', Validators.required),
      price: new FormGroup({
        mrp: new FormControl('', Validators.required),
        offer: new FormControl(''),
        selling: new FormControl(''),
      }),
      brand: new FormControl(''),
      video: new FormControl(''),
      thumbnail: new FormControl(null),
      files: new FormControl([]),
      tax: new FormControl(null),
      hsn: new FormControl('')
    })
  }

  toggleTabIndex(index: number) {
    this.tabIndex = index
  }

  onSubmit() {
    this.form.get('price')?.setValue({
      mrp: this.form.get('price.mrp')?.value,
      offer: this.form.get('price.offer')?.value ? this.form.get('price.offer')?.value : this.form.get('price.mrp')?.value,
      selling: this.form.get('price.offer')?.value ? this.form.get('price.offer')?.value : this.form.get('price.mrp')?.value,
    })

    let files = this.files.map((file: any) => file.path)
    this.form.get('files')?.setValue(files)

    if (!this.form.valid) {
      return
    }
  }

}
