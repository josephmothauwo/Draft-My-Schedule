import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable, of } from 'rxjs';
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
  
  courseComponentsURL: string = 'http://localhost:3000/UA/courses/';
  
  

  getCourseComponents(component:string):Observable<any[]>{
    console.log("get request for courses components!")
    console.log(component)
    return this.http.get<any[]>(`${this.courseComponentsURL}${component}`)
    .pipe(
      catchError(this.handleError)
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
