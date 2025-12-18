import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectListingComponent } from './project-listing/project-listing.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { UpdateProjectComponent } from './update-project/update-project.component';
import { ProjectCategoriesComponent } from './project-categories/project-categories.component';


const routes: Routes = [
  { path: '', component: ProjectListingComponent },
  { path: 'create-project', component: CreateProjectComponent },
  { path: 'update-project/:slug', component: UpdateProjectComponent },
  { path: 'project-categories', component: ProjectCategoriesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
