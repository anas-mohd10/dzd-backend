import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { categoryEndpoints } from 'src/app/config/endpoints/category.endpoints';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoryEndpoints = categoryEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) {}

  addCategory(data: any) {
    const url = this.commonService.getFullUrl(
      this.categoryEndpoints.add_category
    );
    return this.http.post(`${url}`, data);
  }

  getCategory() {
    const url = this.commonService.getFullUrl(
      this.categoryEndpoints.get_category
    );
    return this.http.get(`${url}`);
  }

  // getCategoryById(id: any) {
  //   const url = this.commonService.getFullUrl(
  //     this.categoryEndpoints.get_category_by_id + id
  //   );
  //   return this.http.get(`${url}`);
  // }

  getCategoryBySlug(slug: any) {
    const url = this.commonService.getFullUrl(
      this.categoryEndpoints.get_category_by_slug + '?slug=' + slug
    );
    return this.http.get(`${url}`);
  }

  updateCategory(id: any, data: any) {
    const url = this.commonService.getFullUrl(
      this.categoryEndpoints.update_category + '/' + id
    );
    return this.http.put(`${url}`, data);
  }
}
