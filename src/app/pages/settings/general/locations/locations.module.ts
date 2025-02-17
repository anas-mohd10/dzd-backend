import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocationsRoutingModule } from './locations-routing.module';
import { CountriesComponent } from './countries/countries.component';
import { StatesComponent } from './states/states.component';
import { CitiesComponent } from './cities/cities.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/pages/shared/shared.module';

@NgModule({
  declarations: [
    CountriesComponent,
    StatesComponent,
    CitiesComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule,
    SharedModule,
    LocationsRoutingModule
  ]
})
export class LocationsModule { }
