import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportLogsListComponent } from './export-logs-list/export-logs-list.component';
import { ExportLogsDetailsComponent } from './export-logs-details/export-logs-details.component';

const routes: Routes = [
    { path: '', component: ExportLogsListComponent },
    { path: ':exportId', component: ExportLogsDetailsComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExportLogsRoutingModule { } 