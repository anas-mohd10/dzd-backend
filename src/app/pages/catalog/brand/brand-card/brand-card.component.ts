import { Component, OnInit } from '@angular/core';
import { appRoutes } from 'src/app/config/routes';
import { BrandService } from '../../../../includes/services/brand.service';
import { environment } from 'src/environments/environment.prod';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-brand-card',
  templateUrl: './brand-card.component.html',
  styleUrls: ['./brand-card.component.scss']
})
export class BrandCardComponent implements OnInit {
  brandForm: FormGroup;
  appRoute = appRoutes;
  brandData: any;
  displayTable: boolean = false;
  base: any

  constructor(private brandService: BrandService, private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    this.brandService.getBrand().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.brandData = res?.result
          break;
      }
    });
  }

  initForm() {
    this.brandForm = this.formBuilder.group({
      name: [''],
      isActive: [''],
      isFeatured: [''],
    });
  }

  onSubmit() {
    console.log(this.brandForm.value);
    const data = {}
    this.brandService.searchBrand(data).subscribe((res: any) => {
    })
  }

}
