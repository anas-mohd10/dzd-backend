import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { projectEndpoints } from '../../config/endpoints';

interface ProjectCategory {
    _id: string;
    title: string;
    thumbnail: string;
    slug: string;
    isActive: boolean;
}
@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    constructor(
        private http: HttpClient,
        private commonService: CommonService
    ) { }

    createProject(data: any) {
        const url = this.commonService.getFullUrl(projectEndpoints.createProject);
        return this.http.post(`${url}`, data);
    }

    projects(data: any) {
        const url = this.commonService.getFullUrl(projectEndpoints.projects);
        return this.http.post(`${url}`, data);
    }

    importProjects(formData: any) {
        const url = this.commonService.getFullUrl(projectEndpoints.importProjects);
        return this.http.post(`${url}`, formData);
    }

    projectDetails(project: string) {
        const url = this.commonService.getFullUrl(projectEndpoints.projects + `/${project}`);
        return this.http.get(`${url}`);
    }

    updateProject(data: any) {
        const url = this.commonService.getFullUrl(projectEndpoints.updateProject);
        return this.http.put(`${url}`, data);
    }

    deleteProject(project: string) {
        const url = this.commonService.getFullUrl(projectEndpoints.deleteProject + `/${project}`);
        return this.http.delete(`${url}`);
    }

    activeProjects() {
        const url = this.commonService.getFullUrl(projectEndpoints.activeProjects);
        return this.http.get(`${url}`);
    }

    createCategory(data: any) {
        return this.http.post(this.commonService.getFullUrl(projectEndpoints.createProjectCategory), data);
    }

    getCategories() {
        return this.http.get<{ errorCode: number, result: ProjectCategory[] }>(this.commonService.getFullUrl(projectEndpoints.projectCategories));
    }

    getCategoryDetails(slug: string) {
        return this.http.get(this.commonService.getFullUrl(`${projectEndpoints.projectCategory}/${slug}`));
    }

    updateCategory(categoryId: string | undefined, data: any) {
        return this.http.put(this.commonService.getFullUrl(`${projectEndpoints.updateProjectCategory}/${categoryId}`), data);
    }

    deleteCategory(slug: string) {
        return this.http.delete(this.commonService.getFullUrl(`${projectEndpoints.deleteProjectCategory}/${slug}`));
    }

    getProjectBySlug(slug: string) {
        return this.http.get(this.commonService.getFullUrl(`/projects/${slug}`));
    }
}
