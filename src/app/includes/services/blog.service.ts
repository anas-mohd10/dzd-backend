import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { blogEndpoints } from '../../config/endpoints';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) { }

  createBlog(data: any) {
    const url = this.commonService.getFullUrl(blogEndpoints.createBlog);
    return this.http.post(`${url}`, data);
  }

  blogs(data: any) {
    const url = this.commonService.getFullUrl(blogEndpoints.blogs);
    return this.http.post(`${url}`, data);
  }

  blogDetails(blog: string) {
    const url = this.commonService.getFullUrl(blogEndpoints.blogs + `/${blog}`);
    return this.http.get(`${url}`);
  }

  updateBlog(data: any) {
    const url = this.commonService.getFullUrl(blogEndpoints.updateBlog);
    return this.http.put(`${url}`, data);
  }

  deleteBlog(blog: string) {
    const url = this.commonService.getFullUrl(blogEndpoints.deleteBlog + `/${blog}`);
    return this.http.delete(`${url}`);
  }
}
