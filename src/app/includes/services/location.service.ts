import { Injectable } from '@angular/core';
import { locationEndpoints } from 'src/app/config/endpoints';
import { CommonService } from './common.service';
import { HttpClient } from '@angular/common/http';

interface StateQuery {
  pageIndex: number;
  pageSize: number;
  countryId: string | null;
}

interface CityQuery {
  pageIndex: number;
  pageSize: number;
  countryId: string | null;
  stateId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(
    private HttpClient: HttpClient,
    private CommonService: CommonService
  ) { }

  createCountry(data: any) {
    const url = this.CommonService.getFullUrl(locationEndpoints.addCountry);
    return this.HttpClient.post(url, data);
  }

  getCountries(data: any) {
    const url = this.CommonService.getFullUrl(locationEndpoints.countries);
    return this.HttpClient.post(url, data);
  }

  getCountry(countryId: string) {
    const url = this.CommonService.getFullUrl(locationEndpoints.country + `/${countryId}`);
    return this.HttpClient.get(url);
  }

  updateCountry(countryId: string, data: any) {
    const url = this.CommonService.getFullUrl(locationEndpoints.updateCountry + `/${countryId}`);
    return this.HttpClient.put(url, data);
  }

  createState(data: any) {
    const url = this.CommonService.getFullUrl(locationEndpoints.addState);
    return this.HttpClient.post(url, data);
  }

  deleteCountry(countryId: string | null) {
    const url = this.CommonService.getFullUrl(locationEndpoints.deleteCountry + `/${countryId}`);
    return this.HttpClient.delete(url);
  }

  getStates(query: StateQuery) {
    const url = this.CommonService.getFullUrl(locationEndpoints.states);
    return this.HttpClient.post(url, query);
  }

  getState(stateId: string) {
    const url = this.CommonService.getFullUrl(locationEndpoints.state + `/${stateId}`);
    return this.HttpClient.get(url);
  }

  updateState(stateId: string, data: any) {
    const url = this.CommonService.getFullUrl(locationEndpoints.updateState + `/${stateId}`);
    return this.HttpClient.put(url, data);
  }

  deleteState(stateId: string | null) {
    const url = this.CommonService.getFullUrl(locationEndpoints.deleteState + `/${stateId}`);
    return this.HttpClient.delete(url);
  }

  createCity(data: any) {
    const url = this.CommonService.getFullUrl(locationEndpoints.addCity);
    return this.HttpClient.post(url, data);
  }

  getCities(query: CityQuery) {
    const url = this.CommonService.getFullUrl(locationEndpoints.cities);
    return this.HttpClient.post(url, query);
  }

  getCity(cityId: string) {
    const url = this.CommonService.getFullUrl(locationEndpoints.city + `/${cityId}`);
    return this.HttpClient.get(url);
  }

  updateCity(cityId: string, data: any) {
    const url = this.CommonService.getFullUrl(locationEndpoints.updateCity + `/${cityId}`);
    return this.HttpClient.put(url, data);
  }

  deleteCity(cityId: string | null) {
    const url = this.CommonService.getFullUrl(locationEndpoints.deleteCity + `/${cityId}`);
    return this.HttpClient.delete(url);
  }

  bulkImportLocations(file: any) {
    const url = this.CommonService.getFullUrl(locationEndpoints.bulkImportLocations);
    return this.HttpClient.post(url, file);
  }
}
