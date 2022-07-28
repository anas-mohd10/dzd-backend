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
import { NgSelect2Module } from 'ng-select2';
import { ToastrModule } from 'ngx-toastr';
import { AuthenticationGuard } from './core/auth/authentication.guard';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpInterceptor } from './includes/interceptor/http.interceptor';
import { RouterModule } from '@angular/router';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { DataTablesModule } from 'angular-datatables';
// #fake-end#

@NgModule({
  declarations: [AppComponent],
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
    NgbModule
  ],
  exports: [
    RouterModule,
    NgHttpLoaderModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptor, multi: true },
    AuthenticationGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
