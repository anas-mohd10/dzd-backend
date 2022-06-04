import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

export const Routing: Routes = [
  {
    path: 'app',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/brand/brand-list/brand-list.module').then((m) => m.BrandModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/brand/add-brand/add-brand.module').then((m) => m.AddBrandModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/category/category-list/category-list.module').then((m) => m.CategoryModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/category/add-category/add-category.module').then((m) => m.AddCategoryModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/attritube/add-attribute/add-attribute.module').then((m) => m.AddAttributeModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/attritube/attribute-list/attribute-list.module').then((m) => m.AttributeModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/product/product-list/product-list.module').then((m) => m.ProductModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/product/add-product/add-product.module').then((m) => m.AddProductModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/collection/collection-list/collection-list.module').then((m) => m.CollectionModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/collection/add-collection/add-collection.module').then((m) => m.AddCollectionModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(Routing)],
  exports: [RouterModule],
})

export class RoutingModule {}
