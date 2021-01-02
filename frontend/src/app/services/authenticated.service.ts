import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append("Authorization", "Bearer " + localStorage.getItem('currentToken'));
    const httpOptions = {
      headers: headers
    };
@Injectable({
  providedIn: 'root'
})
export class AuthenticatedService {
  scheduleNameURL: string = 'http://localhost:3000/UA/schedules/';
  allSchedulesURL: string = 'http://localhost:3000/UA/all_schedules';
  addCourseURL: string = 'http://localhost:3000/UA/schedule/courses';
  editScheduleURL: string = 'http://localhost:3000/UA/editSchedule';
  addReviewURL: string = 'http://localhost:3000/UA/addReview';
  // scheduleNameURL: string = '/api/schedules/';
  constructor(private http:HttpClient) { }

  putScheduleName(name:string, description:string, isPublic: string, token: string):Observable<any>{
    return this.http.put(`${this.scheduleNameURL}${name}/${isPublic}/${description}`,null, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }
  deleteSchedule(deleteName:string):Observable<any>{
    console.log("put delete request to delete a schedule");
    return this.http.delete(`${this.scheduleNameURL}${deleteName}`, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  getallSchedules(token: string):Observable<string[]>{
    console.log("get request for all schedules!")
    
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
    console.log("put request for edit a schedule!")
    const body= {
      scheduleName: name.toLocaleUpperCase(),
      newName: newName,
      description: description,
      isPublic: isPublic.toLocaleUpperCase(),
      addCourse: addCourse.toLocaleUpperCase(),
      deleteCourse: deleteCourse.toLocaleUpperCase(),

    };
    console.log(this.editScheduleURL)
    return this.http.put(`${this.editScheduleURL}`,body,httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  addReview(courseName, review):Observable<any>{
    const body= {
      courseName: courseName,
      review: review
    };
    console.log(body)
    return this.http.put(`${this.addReviewURL}`,body,httpOptions)
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
