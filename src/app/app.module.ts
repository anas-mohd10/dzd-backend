import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { AuthenticationGuard } from './core/auth/authentication.guard';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpInterceptor } from './includes/interceptor/http.interceptor';
import { RouterModule } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { DataTablesModule } from 'angular-datatables';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LayoutModule } from './shared/layout';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CsvService } from './includes/services/csv.service';
import { ProductCardComponent } from './pages/catalog/product/product-card/product-card.component';
import { BrandCardComponent } from './pages/catalog/brand/brand-card/brand-card.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArchivedBrandComponent } from './pages/catalog/brand/archived-brand/archived-brand.component';
import { ArchivedCategoryComponent } from './pages/catalog/category/archived-category/archived-category.component';
import { ArchivedProductComponent } from './pages/catalog/product/archived-product/archived-product.component';
import { ArchivedCollectionComponent } from './pages/catalog/collection/archived-collection/archived-collection.component';
import { ProductSuccessComponent } from './pages/catalog/product/product-success/product-success.component';
import { UpdateHeadComponent } from './pages/catalog/product/update-head/update-head.component';


@NgModule({
  declarations: [AppComponent, ProductCardComponent, BrandCardComponent, ArchivedBrandComponent, ArchivedCategoryComponent, ArchivedProductComponent, ArchivedCollectionComponent, ProductSuccessComponent, UpdateHeadComponent],
  imports: [
    DataTablesModule,
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot(),
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    NgbModule,
    NgSelectModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule
  ],
  exports: [
    RouterModule,
    NgHttpLoaderModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptor, multi: true },
    AuthenticationGuard,
    CsvService
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
