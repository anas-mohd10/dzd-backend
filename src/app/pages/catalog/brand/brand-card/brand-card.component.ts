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
  len: any;

  constructor(
    private brandService: BrandService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.base = environment.base
    this.brandService.getBrand().subscribe((res: any) => {
      switch (res?.errorCode) {
        case 0:
          this.brandData = res?.result
          this.len = res?.result.length
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

  onReload(){
    window.location.reload()
  }

  onSubmit() {
    this.brandService.searchBrand(this.brandForm.value).subscribe((res: any) => {
      if(res?.errorCode == 0){
        this.brandData = res?.result
        this.len = res?.result.length
      }
    })
  }

}
