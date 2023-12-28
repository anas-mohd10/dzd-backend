import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogListingComponent } from './catalog-listing/catalog-listing.component';
import { CreateCatalogComponent } from './create-catalog/create-catalog.component';
import { UpdateCatalogComponent } from './update-catalog/update-catalog.component';

const routes: Routes = [
  { path: '', component: CatalogListingComponent },
  { path: 'create-catalog', component: CreateCatalogComponent },
  { path: 'update-catalog/:catalog', component: UpdateCatalogComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
