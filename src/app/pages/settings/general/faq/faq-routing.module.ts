import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFaqComponent } from './add-faq/add-faq.component';
import { FaqListComponent } from './faq-list/faq-list.component';
import { UpdateFaqComponent } from './update-faq/update-faq.component';

const routes: Routes = [
  { path: '', component: FaqListComponent },
  { path: 'add', component: AddFaqComponent },
  { path: 'update', component: UpdateFaqComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }
