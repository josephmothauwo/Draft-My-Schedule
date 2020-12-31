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
export class AuthenticatedService {
  scheduleNameURL: string = 'http://localhost:3000/UA/schedules/';
  // scheduleNameURL: string = '/api/schedules/';
  constructor(private http:HttpClient) { }

  putScheduleName(name:string, description:string, isPublic: string):Observable<any>{
    console.log("put request for schedule",name);
    return this.http.put(`${this.scheduleNameURL}${name}/${isPublic}/${description}`,null, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }
  deleteSchedule(deleteName:string):Observable<any>{
    console.log("put request for schedule");
    return this.http.delete(`${this.scheduleNameURL}${deleteName}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  handleError(error) {
    let errorMessage = '';
    window.alert(errorMessage + "Invalid Input!!!")
    return throwError(errorMessage);
  }
}
