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
  addCourseURL: string = '/http://localhost:3000/UA/schedule/courses';
  editscheduleURL: string = '/http://localhost:3000/UA/editSchedule';
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

  putCourse(subject:string, courseCode:string, scheduleName:string):Observable<any>{
    console.log("put request for adding a course!")
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append("Authorization", "Bearer " + localStorage.getItem('currentToken'));
    const httpOptions = {
      headers: headers
    };
    const body= {
      scheduleName: scheduleName.toLocaleUpperCase(),
      subjectNames: subject.toLocaleUpperCase(),
      courseNumbers: courseCode.toLocaleUpperCase()
    };
    return this.http.put(`${this.addCourseURL}`,body,httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  editSchedule(name, newName, description, isPublic, addCourse, deleteCourse):Observable<any>{
    console.log("put request for adding a course!")
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append("Authorization", "Bearer " + localStorage.getItem('currentToken'));
    const httpOptions = {
      headers: headers
    };
    const body= {
      scheduleName: name.toLocaleUpperCase(),
      newName: name.toLocaleUpperCase(),
      description: description.toLocaleUpperCase(),
      isPublic: isPublic.toLocaleUpperCase(),
      addCourse: addCourse.toLocaleUpperCase(),
      deleteCourse: deleteCourse.toLocaleUpperCase(),

    };
    return this.http.put(`${this.editscheduleURL}`,body,httpOptions)
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
