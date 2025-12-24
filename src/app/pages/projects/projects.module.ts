import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectListingComponent } from './project-listing/project-listing.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { UpdateProjectComponent } from './update-project/update-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../shared/shared.module';
import { ProjectCategoriesComponent } from './project-categories/project-categories.component';

@NgModule({
  declarations: [
    ProjectListingComponent,
    CreateProjectComponent,
    UpdateProjectComponent,
    ProjectCategoriesComponent
  ],
  imports: [
    CommonModule,
    TabsModule,
    ProjectsRoutingModule,
    FormsModule,
    AngularEditorModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ProjectsModule { }
