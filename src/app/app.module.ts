import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { AuthenticationGuard } from './core/auth/authentication.guard';
import { HttpInterceptor } from './includes/interceptor/http.interceptor';
import { RouterModule } from '@angular/router';
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
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
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
import { MonthlyComparisonComponent } from './pages/monthly-comparison/monthly-comparison.component';
import { StorePopupComponent } from './pages/marketing/store-popup/store-popup.component';
import { ActivitiesComponent } from './pages/settings/general/activities/activities.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SalesAnalyticsComponent } from './pages/sales-analytics/sales-analytics.component';
import { DeliverySlotsComponent } from './pages/settings/general/delivery-slots/delivery-slots.component';
import { SharedModule } from './pages/shared/shared.module';
import { LoyaltyComponent } from './pages/marketing/loyalty/loyalty.component';
import { ReferralComponent } from './pages/marketing/referral/referral.component';
import { GiftWrapComponent } from './pages/marketing/gift-wrap/gift-wrap.component';
import { BannerImagesComponent } from './pages/marketing/banner-images/banner-images.component';
import { CustomMailersComponent } from './pages/settings/general/custom-mailers/custom-mailers.component';
import { MailerDetailsComponent } from './pages/settings/general/mailer-details/mailer-details.component';
import { SmsTemplatesComponent } from './pages/settings/general/sms-templates/sms-templates.component';
import { GuestsComponent } from './pages/users/guests/guests.component';
import { ShippingChargeComponent } from './pages/settings/general/shipping-charge/shipping-charge.component';
import { BulkInvoicesComponent } from './pages/bulk-invoices/bulk-invoices.component';
import { BulkPackingSlipsComponent } from './pages/bulk-packing-slips/bulk-packing-slips.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { PageCoversComponent } from './pages/page-covers/page-covers.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaymentSettingsComponent } from './pages/settings/general/payment-settings/payment-settings.component';
import { CreateProductsComponent } from './pages/catalog/product/create-products/create-products.component';
import { ShippingRulesComponent } from './pages/settings/general/shipping-rules/shipping-rules.component';
import { InternationalisationComponent } from './pages/settings/general/internationalisation/internationalisation.component';
import { SmsSettingsComponent } from './pages/settings/general/sms-settings/sms-settings.component';
import { AuthenticationComponent } from './pages/settings/general/authentication/authentication.component';
import { AppKeysComponent } from './pages/settings/general/app-keys/app-keys.component';
import { CartSettingsComponent } from './pages/settings/general/cart-settings/cart-settings.component';
import { OrderSettingsComponent } from './pages/settings/general/order-settings/order-settings.component';
import { FiltersComponent } from './pages/catalog/filters/filters.component';
import { SitemapSettingsComponent } from './pages/settings/general/sitemap-settings/sitemap-settings.component';
import { CompareKeysComponent } from './pages/catalog/compare-keys/compare-keys.component';
import { ToastComponent } from './pages/settings/general/toast/toast.component';
import { NavigationSettingsComponent } from './pages/navigation-settings/navigation-settings.component';
import { MenuNavigationComponent } from './pages/settings/general/menu-navigation/menu-navigation.component';
import { FormSettingsComponent } from './pages/settings/general/form-settings/form-settings.component';
import { FormAddressComponent } from './pages/settings/general/form-settings/form-address/form-address.component';
import { FormLoginComponent } from './pages/settings/general/form-settings/form-login/form-login.component';
import { CurrencySettingsComponent } from './pages/settings/general/currency-settings/currency-settings.component';

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
    ShippingComponent,
    MonthlyComparisonComponent,
    StorePopupComponent,
    ActivitiesComponent,
    SalesAnalyticsComponent,
    DeliverySlotsComponent,
    LoyaltyComponent,
    ReferralComponent,
    GiftWrapComponent,
    BannerImagesComponent,
    CustomMailersComponent,
    MailerDetailsComponent,
    GuestsComponent,
    ShippingChargeComponent,
    BulkInvoicesComponent,
    BulkPackingSlipsComponent,
    PageCoversComponent,
    PaymentSettingsComponent,
    CreateProductsComponent,
    ShippingRulesComponent,
    InternationalisationComponent,
    SmsSettingsComponent,
    SmsTemplatesComponent,
    AuthenticationComponent,
    AppKeysComponent,
    CartSettingsComponent,
    OrderSettingsComponent,
    FiltersComponent,
    SitemapSettingsComponent,
    CompareKeysComponent,
    ToastComponent,
    NavigationSettingsComponent,
    MenuNavigationComponent,
    FormSettingsComponent,
    FormAddressComponent,
    FormLoginComponent,
    CurrencySettingsComponent,
  ],
  imports: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideMessaging(() => getMessaging()),
    BrowserModule,
    BrowserAnimationsModule,
    BsDropdownModule,
    HttpClientModule,
    ClipboardModule,
    MonacoEditorModule.forRoot(),
    InlineSVGModule.forRoot(),
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    ToastrModule.forRoot({ timeOut: 4000, positionClass: 'toast-bottom-center', preventDuplicates: true }),
    HotToastModule.forRoot({ position: 'bottom-center' }),
    TooltipModule.forRoot(),
    AppRoutingModule,
    NgApexchartsModule,
    AngularEditorModule,
    ReactiveFormsModule,
    DragDropModule,
    NgbModule,
    NgSelectModule,
    // LayoutModule,
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    ImageCropperModule,
    SwiperModule,
    TabsModule.forRoot(),
    SharedModule,
],
  exports: [
    RouterModule,
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
