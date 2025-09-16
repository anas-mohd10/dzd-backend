import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogListingComponent } from './blog-listing/blog-listing.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { UpdateBlogComponent } from './update-blog/update-blog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module';
import { BlogCategoriesComponent } from './blog-categories/blog-categories.component';

@NgModule({
  declarations: [
    BlogListingComponent,
    CreateBlogComponent,
    UpdateBlogComponent,
    BlogCategoriesComponent
  ],
  imports: [
    CommonModule,
    TabsModule,
    BlogsRoutingModule,
    FormsModule,
    AngularEditorModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class BlogsModule { }
