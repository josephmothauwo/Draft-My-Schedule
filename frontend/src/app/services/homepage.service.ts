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
  
  courseComponentsURL: string = 'http://localhost:3000/UA/courses/';

  getCourseComponents(component:string):Observable<any[]>{
    console.log("get request for courses components!")
    console.log(component)
    return this.http.get<string[]>(`${this.courseComponentsURL}${component}`)
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
