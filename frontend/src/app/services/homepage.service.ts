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
  allCoursesURL: string = '/api/all_courses';
  coursesURL: string = '/api/courses/';
  courseComponentsURL: string = '/api/courses/';
  scheduleURL: string = '/api/schedules/';
  scheduleNameURL: string = '/api/schedules/';
  schedulesURL: string = '/api/all_schedules';
  addCourseURL: string = '/api/schedule/courses';

  getCourses():Observable<any>{
    console.log("getcourses")
    return this.http.get<any>(this.allCoursesURL)
  }

  getCourseCodes(courseCodeInput:string):Observable<string[]>{
    console.log("get request for courses codes!")
    return this.http.get<string[]>(`${this.coursesURL}${courseCodeInput}`)
    .pipe(
      catchError(this.handleError<any>())
    );
  }

  putCourse(subject:string, courseCode:string, scheduleName:string):Observable<any>{
    console.log("put request for adding a course!")
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

  getCourseComponents(component:string):Observable<any[]>{
    console.log("get request for courses components!")
    return this.http.get<any[]>(`${this.courseComponentsURL}${component}`)
    .pipe(
      catchError(this.handleError)
    );
  }
  getOneSchedule(scheduleName:string):Observable<string[]>{
    console.log("get request for courses codes!")
    return this.http.get<string[]>(`${this.scheduleURL}${scheduleName}`)
    .pipe(
      catchError(this.handleError)
    );
  }

  putScheduleName(name:string):Observable<any>{
    console.log("put request for schedule",name);
    return this.http.put(`${this.scheduleNameURL}${name}`,null, httpOptions)
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

  getallSchedules():Observable<string[]>{
    console.log("get request for all schedules!")
    return this.http.get<string[]>(`${this.schedulesURL}`)
    .pipe(
      catchError(this.handleError)
    );
  }
  
  deleteAllSchedules():Observable<any>{
    console.log("delete request for all schedules!")
    return this.http.delete(`${this.schedulesURL}`)
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
