import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountriesComponent } from './countries/countries.component';
import { StatesComponent } from './states/states.component';
import { CitiesComponent } from './cities/cities.component';

const routes: Routes = [
  { path: 'countries', component: CountriesComponent },
  { path: 'states/:countryId', component: StatesComponent },
  { path: 'cities/:countryId/:stateId', component: CitiesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule { }
