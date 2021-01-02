import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


let headers: HttpHeaders = new HttpHeaders();
headers = headers.append('Accept', 'application/json');
@Injectable({
  providedIn: 'root'
})
export class AuthenticatedService {
  scheduleNameURL: string = 'http://localhost:3000/UA/schedules/';
  allSchedulesURL: string = 'http://localhost:3000/UA/all_schedules';
  // scheduleNameURL: string = '/api/schedules/';
  constructor(private http:HttpClient) { }

  putScheduleName(name:string, description:string, isPublic: string, token: string):Observable<any>{
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json'); 
    headers = headers.append("Authorization", "Bearer " + token);
    const httpOptions = {
      headers: headers
    };
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

  getallSchedules(token: string):Observable<string[]>{
    console.log("get request for all schedules!")
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append("Authorization", "Bearer " + token);
    const httpOptions = {
      headers: headers
    };
    return this.http.get<string[]>(`${this.allSchedulesURL}`, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  handleError(err) {
    let errorMessage = '';
    console.log(err)
    window.alert(err.error);
    return throwError(errorMessage);
  }
}
