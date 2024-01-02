import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogsRoutingModule } from './blogs-routing.module';
import { BlogListingComponent } from './blog-listing/blog-listing.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { UpdateBlogComponent } from './update-blog/update-blog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    BlogListingComponent,
    CreateBlogComponent,
    UpdateBlogComponent
  ],
  imports: [
    CommonModule,
    BlogsRoutingModule,
    FormsModule,
    AngularEditorModule,
    BsDatepickerModule.forRoot(),
    ReactiveFormsModule,
    SharedModule
  ]
})
export class BlogsModule { }
