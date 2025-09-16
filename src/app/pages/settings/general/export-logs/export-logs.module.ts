import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportLogsRoutingModule } from './export-logs-routing.module';
import { RouterModule } from '@angular/router';
import { ExportLogsListComponent } from './export-logs-list/export-logs-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/pages/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ExportLogsDetailsComponent } from './export-logs-details/export-logs-details.component';

@NgModule({
    declarations: [
        ExportLogsListComponent,
        ExportLogsDetailsComponent
    ],
    imports: [
        CommonModule,
        ExportLogsRoutingModule,
        RouterModule,
        SharedModule,
        FormsModule,
        BsDatepickerModule,
        ReactiveFormsModule
    ]
})
export class ExportLogsModule { } 