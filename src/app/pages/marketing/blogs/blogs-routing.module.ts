import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListingComponent } from './blog-listing/blog-listing.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { UpdateBlogComponent } from './update-blog/update-blog.component';

const routes: Routes = [
  { path: '', component: BlogListingComponent },
  { path: 'create-blog', component: CreateBlogComponent },
  {
    path: 'update-blog/:slug',  // Changed from 'update-blog'
    component: UpdateBlogComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
