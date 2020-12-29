import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomepageService {

  constructor(private http:HttpClient) { }
  coursesURL: string = '/api/all_courses';

  getCourses():Observable<any>{
    console.log("getcourses")
    return this.http.get<any>(this.coursesURL)
  }

  getCourseCodes(courseCodeInput:string):Observable<string[]>{
    console.log("get request for courses codes!")
    return this.http.get<string[]>(`${this.coursesURL}${courseCodeInput}`)
    .pipe(
      catchError(this.handleError<any>())
    );
  }

  private handleError<T>(result?: T) {
    return (error: any): Observable<T> => {
      // Display error in alert
      alert(error.error)

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
