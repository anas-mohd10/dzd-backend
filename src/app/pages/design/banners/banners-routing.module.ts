import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBannerListComponent } from './add-banner-list/add-banner-list.component';
import { BannerListComponent } from './banner-list/banner-list.component';
import { UpdateBannerListComponent } from './update-banner-list/update-banner-list.component';

const routes: Routes = [
  { path: '', component: BannerListComponent },
  { path: 'add', component: AddBannerListComponent },
  { path: 'update', component: UpdateBannerListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BannersRoutingModule { }
