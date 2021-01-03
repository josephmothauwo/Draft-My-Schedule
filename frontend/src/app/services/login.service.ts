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
  login(email:string, password:string):Observable<any>{
    const body= {
      email: email,
      password: password,
    };
    return this.http.post(`${this.loginURL}`,body,httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  handleError(error) {
    let errorMessage = '';
    window.alert(error.error);
    return throwError(error);
  }
}
