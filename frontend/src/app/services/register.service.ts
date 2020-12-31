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
export class RegisterService {

  registerURL: string = 'http://localhost:3000/UA/register'
  constructor(private http:HttpClient) { }
  register(email:string, username:string, password:string):Observable<any>{
    const body= {
      email: email,
      username: username,
      password: password,
    };
    return this.http.post(`${this.registerURL}`,body,httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  validate(token: string){
    return this.http.get(`${token}`)
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
