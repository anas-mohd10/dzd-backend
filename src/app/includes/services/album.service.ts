import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { albumEndpoints } from '../../config/endpoints';

export interface Album {
  title: string
  description: string
  thumbnail: string
  _id: string
  slug: string
  isActive: boolean
  isDelete: boolean
  createdAt: string
  updatedAt: string
}

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  createAlbum(data: any) {
    const url = this.CommonService.getFullUrl(albumEndpoints.createAlbum);
    return this.HttpClient.post(url, data)
  }

  getAlbums() {
    const url = this.CommonService.getFullUrl(albumEndpoints.getAlbums);
    return this.HttpClient.get(url)
  }

  searchAlbums(page: number, limit: number) {
    const url = this.CommonService.getFullUrl(albumEndpoints.searchAlbums);
    return this.HttpClient.get(`${url}?page=${page}&limit=${limit}`)
  }

  getAlbum(data: any) {
    const url = this.CommonService.getFullUrl(albumEndpoints.getAlbum);
    return this.HttpClient.get(`${url}/${data}`)
  }

  updateAlbum(albumId: string | null, data: Album) {
    const url = this.CommonService.getFullUrl(albumEndpoints.updateAlbum);
    return this.HttpClient.put(`${url}/${albumId}`, data)
  }

  deleteAlbum(albumId: string | null) {
    const url = this.CommonService.getFullUrl(albumEndpoints.deleteAlbum);
    return this.HttpClient.delete(`${url}/${albumId}`)
  }

  createGallery(data: any) {
    const url = this.CommonService.getFullUrl(albumEndpoints.createGallery);
    return this.HttpClient.post(url, data)
  }

  getGalleries() {
    const url = this.CommonService.getFullUrl(albumEndpoints.getGalleries);
    return this.HttpClient.get(url)
  }

  searchGalleries(albumId: string | undefined, page: number, limit: number) {
    const url = this.CommonService.getFullUrl(albumEndpoints.searchGalleries);
    return this.HttpClient.get(`${url}/${albumId}?page=${page}&limit=${limit}`)
  }

  getGallery(galleryId: string | null) {
    const url = this.CommonService.getFullUrl(albumEndpoints.getGallery);
    return this.HttpClient.get(`${url}/${galleryId}`)
  }

  updateGallery(galleryId: string | null, data: any) {
    const url = this.CommonService.getFullUrl(albumEndpoints.updateGallery);
    return this.HttpClient.put(`${url}/${galleryId}`, data)
  }

  deleteGallery(galleryId: string | null) {
    const url = this.CommonService.getFullUrl(albumEndpoints.deleteGallery);
    return this.HttpClient.delete(`${url}/${galleryId}`)
  }
}
