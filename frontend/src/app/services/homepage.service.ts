import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})

export class HomepageService {

  constructor(private http:HttpClient) { }
  
  courseComponentsURL: string = '/UA/courses/';
  keyWordURL: string = '/UA/keyword/';
  publicCourseListsURL : string = '/UA/publicCourseLists';
  getCourseComponents(component:string):Observable<any[]>{
    console.log("get request for courses components!")
    console.log(component)
    return this.http.get<string[]>(`${this.courseComponentsURL}${component}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  keyWordSearch(keyWord:string):Observable<any[]>{
    console.log("get request for keywords!")
    
    return this.http.get<string[]>(`${this.keyWordURL}${keyWord}`)
    .pipe(
      catchError(this.handleError)
    );
  }
  getPublicCoursesLists():Observable<any[]>{
    console.log("get request for public course lists!")
    return this.http.get<string[]>(`${this.publicCourseListsURL}`)
    .pipe(
      catchError(this.handleError)
    );
  }
  handleError(error) {
    let errorMessage = '';
    console.log(error)
    window.alert(error.error);
    return throwError(errorMessage);
  }
}
