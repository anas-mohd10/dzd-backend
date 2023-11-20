import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthenticationGuard } from './core/auth/authentication.guard';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpInterceptor } from './includes/interceptor/http.interceptor';
import { RouterModule } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { DataTablesModule } from 'angular-datatables';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LayoutModule } from './shared/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AllProductsComponent } from './pages/catalog/product/all-products/all-products.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { SeoDetailsComponent } from './pages/settings/general/seo-details/seo-details.component';
import { TimeslotsComponent } from './pages/settings/general/timeslots/timeslots.component';
import { EnquiresComponent } from './pages/sales/enquires/enquires.component';
import { CommonModule } from '@angular/common';
import { SwiperModule } from 'swiper/angular';
import { GenerateInvoiceComponent } from './pages/generate-invoice/generate-invoice.component';
import { PackingSlipComponent } from './pages/packing-slip/packing-slip.component';
import { CDK_DRAG_CONFIG } from '@angular/cdk/drag-drop';
import { NgApexchartsModule } from "ng-apexcharts";
import { DynamicScriptsComponent } from './pages/settings/general/dynamic-scripts/dynamic-scripts.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { AnalyticsComponent } from './pages/settings/general/analytics/analytics.component';
import { FeedsComponent } from './pages/marketing/feeds/feeds.component';
import { NavigationMenuComponent } from './pages/settings/general/navigation-menu/navigation-menu.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HotToastModule } from '@ngneat/hot-toast';
import { NotificationPermissionComponent } from './shared/layout/components/notification-permission/notification-permission.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { AngularFireModule, FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';
import { SubscribersComponent } from './pages/users/subscribers/subscribers.component';
import { DetailedOrderComponent } from './pages/reports/detailed-order/detailed-order.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { PaymentPolicyComponent } from './pages/pages/payment-policy/payment-policy.component';
import { ShippingPolicyComponent } from './pages/pages/shipping-policy/shipping-policy.component';
import { ServiceWarrantyComponent } from './pages/pages/service-warranty/service-warranty.component';
import { getMessaging, provideMessaging } from '@angular/fire/messaging';
import { RefundPolicyComponent } from './pages/pages/refund-policy/refund-policy.component';
import { SupportEmailVerificationComponent } from './pages/support-email-verification/support-email-verification.component';
import { MobileAppsComponent } from './pages/settings/general/mobile-apps/mobile-apps.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MailerComponent } from './pages/settings/general/mailer/mailer.component';
import { ShippingComponent } from './pages/settings/general/shipping/shipping.component';

const DragConfig = {
  dragStartThreshold: 0,
  pointerDirectionChangeThreshold: 5,
  zIndex: 10000
};

@NgModule({
  declarations: [
    AppComponent,
    ProductCardComponent,
    BrandCardComponent,
    ArchivedBrandComponent,
    ArchivedCategoryComponent,
    ArchivedProductComponent,
    ArchivedCollectionComponent,
    ProductSuccessComponent,
    UpdateHeadComponent,
    AllProductsComponent,
    MyAccountComponent,
    SeoDetailsComponent,
    TimeslotsComponent,
    EnquiresComponent,
    GenerateInvoiceComponent,
    PackingSlipComponent,
    DynamicScriptsComponent,
    AnalyticsComponent,
    FeedsComponent,
    NavigationMenuComponent,
    NotificationPermissionComponent,
    SubscribersComponent,
    DetailedOrderComponent,
    PaymentPolicyComponent,
    ShippingPolicyComponent,
    ServiceWarrantyComponent,
    RefundPolicyComponent,
    SupportEmailVerificationComponent,
    MobileAppsComponent,
    MailerComponent,
    ShippingComponent
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideMessaging(() => getMessaging()),
    DataTablesModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ClipboardModule,
    TranslateModule.forRoot(),
    MonacoEditorModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    InlineSVGModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    ModalModule.forRoot(),
    ToastrModule.forRoot({ timeOut: 4000, positionClass: 'toast-bottom-center', preventDuplicates: true }),
    HotToastModule.forRoot(),
    AppRoutingModule,
    NgApexchartsModule,
    AngularEditorModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    LayoutModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    ImageCropperModule,
    SwiperModule,
    TabsModule.forRoot()
  ],
  exports: [
    RouterModule,
    NgHttpLoaderModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptor, multi: true },
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
    { provide: CDK_DRAG_CONFIG, useValue: DragConfig },
    AuthenticationGuard,
    CsvService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
