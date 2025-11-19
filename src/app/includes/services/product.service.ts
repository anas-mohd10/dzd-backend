import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonService } from './common.service';
import { productEndpoints } from '../../config/endpoints';
import { Observable, throwError, timer } from 'rxjs';
import { retryWhen, mergeMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productEndpoints = productEndpoints;

  constructor(private http: HttpClient, private commonService: CommonService) { }

  /**
   * Reusable retry helper function for HTTP requests
   * Implements exponential backoff retry logic for specific error codes
   * 
   * @param maxRetryAttempts - Maximum number of retry attempts (default: 3)
   * @param retryableErrorCodes - Array of HTTP status codes to retry (default: [502])
   * @param scalingDuration - Base delay in milliseconds for exponential backoff (default: 1000ms)
   * @returns RxJS operator function for retry logic
   */
  private retryWithExponentialBackoff(
    maxRetryAttempts: number = 3,
    retryableErrorCodes: number[] = [502],
    scalingDuration: number = 1000
  ) {
    return (source: Observable<any>) =>
      source.pipe(
        retryWhen((errors) =>
          errors.pipe(
            mergeMap((error: HttpErrorResponse, retryIndex) => {
              const attemptNumber = retryIndex + 1;
              
              // Only retry if the error code is in the retryable list and we haven't exceeded max attempts
              if (retryableErrorCodes.includes(error.status) && attemptNumber <= maxRetryAttempts) {
                // Calculate exponential backoff delay: 1s, 2s, 3s for attempts 1, 2, 3
                const delay = scalingDuration * attemptNumber;
                
                console.log(`Retrying update request due to ${error.status} error (attempt ${attemptNumber} of ${maxRetryAttempts})`);
                
                // Return timer observable that delays the retry
                return timer(delay);
              } else {
                // For non-retryable errors or when max attempts exceeded, propagate the error
                return throwError(() => error);
              }
            })
          )
        ),
        // Catch any final errors after retries are exhausted
        catchError((error: HttpErrorResponse) => {
          // If it's still a 502 after all retries, show user-friendly message
          if (error.status === 502) {
            console.error('Product update failed after maximum retry attempts');
            // Return a formatted error response that the component can handle
            return throwError(() => ({
              errorCode: -1,
              message: 'Product update failed. Please try again.',
              status: error.status,
              statusText: error.statusText
            }));
          }
          // For other errors, propagate as-is
          return throwError(() => error);
        })
      );
  }

  addProduct(data: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.add_product);
    return this.http.post(`${url}`, data);
  }

  getBulkProducts(productIds: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.getBulkProducts);
    return this.http.post(`${url}`, productIds);
  }

  getProductOffers(offerId: string, page: number = 1, limit: number = 10) {
    const url = this.commonService.getFullUrl(this.productEndpoints.getProductOffers + `/${offerId}?page=${page}&limit=${limit}`);
    return this.http.get(`${url}`);
  }

  getProductHistory(productId: string, pageIndex: number = 1, pageSize: number = 20) {
    const url = this.commonService.getFullUrl(this.productEndpoints.productHistory + `/${pageIndex}/${productId}/${pageSize}`);
    return this.http.get(`${url}`);
  }

  exportProducts(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.exportProducts);
    return this.http.post(`${url}`, query);
  }

  importProducts(file: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.importProducts);
    return this.http.post(`${url}`, file);
  }

  importAddOnProducts(file: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.importAddOnProducts);
    return this.http.post(`${url}`, file);
  }

  manageChildProducts(productId: string, payload: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.manageChildProducts + `/${productId}`);
    return this.http.post(`${url}`, payload);
  }

  getProductbyId(data: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.product_by_prodid);
    return this.http.post(`${url}`, data);
  }

  getProduct() {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_product);
    return this.http.get(`${url}`);
  }

  getProductStoreFields() {
    const url = this.commonService.getFullUrl(this.productEndpoints.productStoreFields);
    return this.http.get(`${url}`);
  }

  updateStoreField(storeFieldValue: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.updateProductStoreFields);
    return this.http.put(`${url}`, storeFieldValue);
  }

  getProductById(data: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_product_by_id);
    return this.http.post(`${url}`, data);
  }

  getProductByPage(page: any, limit: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_product_page + "?page=" + page + "&limit=" + limit);
    return this.http.get(`${url}`);
  }

  getProductsCount() {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_products_count);
    return this.http.get(`${url}`);
  }

  getActiveProduct() {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_active_products);
    return this.http.get(`${url}`);
  }

  getProductBySlug(slug: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_product_by_slug + '?slug=' + slug);
    return this.http.get(`${url}`);
  }

  getProductNames() {
    const url = this.commonService.getFullUrl(this.productEndpoints.get_product_names);
    return this.http.get(`${url}`);
  }

  searchProducts(query: any, condition?: string) {
    const url = this.commonService.getFullUrl(this.productEndpoints.search_product + (condition ? `?condition=${condition}` : ``));
    return this.http.post(`${url}`, query);
  }

  findProducts(data: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.search_products);
    return this.http.post(`${url}`, data);
  }

  productTags(data: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.productTags);
    return this.http.post(`${url}`, data);
  }

  dropdownProducts(keyword: string, page: number = 1, type: string = 'active') {
    const url = this.commonService.getFullUrl(this.productEndpoints.dropdownProducts + `?page=${page}&type=${type}&keyword=${keyword}`);
    return this.http.get(`${url}`);
  }

  archivedProducts(query: any, page: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.archive_product + "?page=" + page);
    return this.http.post(`${url}`, query);
  }

  restoreProducts(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.restore_product);
    return this.http.post(`${url}`, query);
  }

  /**
   * Update product with robust retry mechanism for handling temporary failures
   * 
   * Implements exponential backoff retry logic specifically for HTTP 502 (Bad Gateway) errors
   * - Retries up to 3 times with delays of 1s, 2s, 3s respectively
   * - Immediately propagates other error types without retry attempts
   * - Provides user-friendly error messages after all retries are exhausted
   * 
   * @param slug - Product slug identifier
   * @param data - Product update payload
   * @returns Observable with retry logic applied
   */
  updateProduct(slug: any, data: any): Observable<any> {
    const url = this.commonService.getFullUrl(this.productEndpoints.update_product + "?slug=" + slug);
    
    // Apply retry logic to the HTTP PUT request
    return this.http.put(`${url}`, data).pipe(
      this.retryWithExponentialBackoff(3, [502], 1000)
    );
  }

  updateProductStatus(productDoc: { _id: string, isActive: boolean }) {
    const url = this.commonService.getFullUrl(this.productEndpoints.updateProductStatus);
    return this.http.patch(`${url}`, productDoc);
  }

  getProductWebData(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.product_datas);
    return this.http.post(`${url}`, query);
  }

  productImages(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.product_images);
    return this.http.post(`${url}`, query);
  }

  deleteProduct(productId: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.deleteProduct);
    return this.http.delete(`${url}/${productId}`);
  }

  deleteProducts(productIds: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.deleteProducts);
    return this.http.delete(`${url}`, { body: productIds });
  }

  productThumbnailImages(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.thumbnail_images);
    return this.http.post(`${url}`, query);
  }

  bulkFileUpload(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.products_bulk_file_upload);
    return this.http.post(`${url}`, query);
  }

  bulkMediaUpload(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.products_bulk_image_upload);
    return this.http.post(`${url}`, query);
  }

  bulkThumbnailUpload(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.products_bulk_thumbnail_upload);
    return this.http.post(`${url}`, query);
  }

  productVideo(data: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.productVideo);
    return this.http.put(`${url}`, data);
  }

  deleteVideo(product: string) {
    const url = this.commonService.getFullUrl(this.productEndpoints.deleteVideo + `/${product}`);
    return this.http.put(`${url}`, {});
  }

  deleteImage(product: string, file: string) {
    const url = this.commonService.getFullUrl(this.productEndpoints.deleteImage + `/${product}`);
    return this.http.put(`${url}`, { file: file });
  }

  addProductCover(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.addProductCover);
    return this.http.put(`${url}`, query);
  }

  removeProductCover(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.removeProductCover);
    return this.http.put(`${url}`, query);
  }


  //Product details for dashboard
  getProductDetails(productSlug: string) {
    const url = this.commonService.getFullUrl(this.productEndpoints.getProductDetails);
    return this.http.post(`${url}`, { productSlug });
  }
  //Product details for dashboard

  //Get products from query
  getProducts(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.getProducts);
    return this.http.post(`${url}`, query);
  }

  //update product status
  bulkUpdateProducts(query: any) {
    const url = this.commonService.getFullUrl(this.productEndpoints.bulkUpdateProducts);
    return this.http.post(`${url}`, query);
  }
}
