import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CatalogComponent } from './catalog/catalog.component';
import { ThemeComponent } from './theme/theme.component';
import { AppImagesComponent } from './app-images/app-images.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';


const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "about-us", component: AboutComponent },
  { path: "catalogs", component: CatalogComponent },
  { path: "theme", component: ThemeComponent },
  { path: "app-images", component: AppImagesComponent },
  { path: "contact-us", component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreDesignsRoutingModule { }
