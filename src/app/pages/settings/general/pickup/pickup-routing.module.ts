import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PickupListComponent } from './pickup-list/pickup-list.component';
import { CreatePickupComponent } from './create-pickup/create-pickup.component';
import { UpdatePickupComponent } from './update-pickup/update-pickup.component';

const routes: Routes = [
  { path: '', component: PickupListComponent },
  { path: 'add', component: CreatePickupComponent },
  { path: 'update/:pickupId', component: UpdatePickupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickupRoutingModule { }
