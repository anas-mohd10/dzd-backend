import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogListingComponent } from './blog-listing/blog-listing.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { UpdateBlogComponent } from './update-blog/update-blog.component';
import { BlogCategoriesComponent } from './blog-categories/blog-categories.component';


const routes: Routes = [
  { path: '', component: BlogListingComponent },
  { path: 'create-blog', component: CreateBlogComponent },
  { path: 'update-blog/:slug', component: UpdateBlogComponent },
  { path: 'blog-categories', component: BlogCategoriesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogsRoutingModule { }
