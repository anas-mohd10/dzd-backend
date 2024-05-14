import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { categoryEndpoints } from 'src/app/config/endpoints/category.endpoints';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categoryEndpoints = categoryEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  addCategory(data: any) {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.add_category);
    return this.http.post(`${url}`, data);
  }

  getCategory() {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.get_category);
    return this.http.get(`${url}`);
  }

  getActiveCategory() {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.get_active_categories);
    return this.http.get(`${url}`);
  }

  searchCategory(query: any) {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.search_category);
    return this.http.post(`${url}`, query);
  }

  getCategoryDetails(slug: any) {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.getCategoryDetails + '?slug=' + slug);
    return this.http.get(`${url}`);
  }

  updateCategory(slug: any, data: any) {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.update_category + '?slug=' + slug);
    return this.http.put(`${url}`, data);
  }

  getMainCategories() {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.get_main_categories);
    return this.http.get(`${url}`);
  }

  getSubCategoriesDetails(data: any) {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.get_subcategories_details);
    return this.http.post(`${url}`, data);
  }

  archivedCategories(data: any, page: any) {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.archived_categories + "?page=" + page);
    return this.http.post(`${url}`, data);
  }

  childCategories(data: any) {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.childCategories);
    return this.http.post(`${url}`, data);
  }

  bulkFileUpload(data: any) {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.category_bulk_file_upload);
    return this.http.post(`${url}`, data);
  }

  bulkMediaUpload(data: any) {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.categories_bulk_image_upload);
    return this.http.post(`${url}`, data);
  }

  findCategories(data: any) {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.find_categories);
    return this.http.post(`${url}`, data);
  }

  getMenuCategories() {
    const url = this.commonService.getWebUrl('mega-categories');
    return this.http.get(`${url}`);
  }

  getCategories(data: any, query: any) {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.get_categories + `?type=${query}`);
    return this.http.post(`${url}`, data);
  }

  getSubCategories(data: any) {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.get_sub_categories);
    return this.http.post(`${url}`, data);
  }

  dropdownCategories(keyword: string, page: number = 1, type: string = 'active') {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.dropdownCategories + `?page=${page}&type=${type}&keyword=${keyword}`);
    return this.http.get(`${url}`);
  }

  defaultCategories(category: string) {
    const url = this.commonService.getFullUrl(this.categoryEndpoints.defaultCategories + `?category=${category}`);
    return this.http.get(`${url}`);
  }
}
