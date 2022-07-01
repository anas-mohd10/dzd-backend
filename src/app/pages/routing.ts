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
      import('./catalog/brand/brand-list/brand-list.module').then(
        (m) => m.BrandModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/brand/add-brand/add-brand.module').then(
        (m) => m.AddBrandModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/brand/update-brand/update-brand.module').then(
        (m) => m.UpdateBrandModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/category/category-list/category-list.module').then(
        (m) => m.CategoryModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/category/add-category/add-category.module').then(
        (m) => m.AddCategoryModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/attritube/add-attribute/add-attribute.module').then(
        (m) => m.AddAttributeModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/attritube/attribute-list/attribute-list.module').then(
        (m) => m.AttributeModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import(
        './catalog/attritube/update-attribute/update-attribute.module'
      ).then((m) => m.UpdateAttributeModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/product/product-list/product-list.module').then(
        (m) => m.ProductModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/product/add-product/add-product.module').then(
        (m) => m.AddProductModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import(
        './catalog/collection/collection-list/collection-list.module'
      ).then((m) => m.CollectionModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./catalog/collection/add-collection/add-collection.module').then(
        (m) => m.AddCollectionModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import(
        './catalog/collection/update-collection/update-collection.module'
      ).then((m) => m.UpdateCollectionModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./marketing/offer/offer-list/offer-list.module').then(
        (m) => m.OfferModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./marketing/offer/add-offer/add-offer.module').then(
        (m) => m.AddOfferModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./marketing/offer/update-offer/update-offer.module').then(
        (m) => m.UpdateOfferModule
      ),
  },
  {
    path: 'app',
    loadChildren: () =>
      import(
        './settings/localization/tax/tax-classes/tax-class-list/tax-class-list.component.module'
      ).then((m) => m.TaxClassModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import(
        './settings/localization/tax/tax-classes/add-tax-class/add-tax-class.component.module'
      ).then((m) => m.AddTaxClassModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import(
        './settings/localization/tax/tax-classes/update-tax-class/update-tax-class.component.module'
      ).then((m) => m.UpdateTaxClassModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import(
        './settings/localization/tax/tax-rules/tax-rules-list/tax-rules-list.component.module'
      ).then((m) => m.TaxRulesModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import(
        './settings/localization/tax/tax-rules/add-tax-rules/add-tax-rules.component.module'
      ).then((m) => m.AddTaxClassModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import(
        './settings/localization/tax/tax-rules/update-tax-rules/update-tax-rules.component.module'
      ).then((m) => m.UpdateTaxClassModule),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./sales/shipping/shipping-list/shipping-list.module').then(
        (m) => m.ShippingModule
      ),
  },
  {
    path: '',
    redirectTo: '/app/dashboard',
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
