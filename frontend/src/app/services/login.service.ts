import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable,throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loginURL: string = 'http://localhost:3000/UA/login'
  constructor(private http:HttpClient) { }
  login(username:string, password:string):Observable<any>{
    console.log("put request for adding a course!")
    const body= {
      username: password.toLocaleUpperCase(),
      subjectNames: username.toLocaleUpperCase(),
    };
    return this.http.post(`${this.loginURL}`,body,httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  handleError(error) {
    let errorMessage = '';
    window.alert(errorMessage+"Invalid Input!!!");
    return throwError(errorMessage);
  }
}
