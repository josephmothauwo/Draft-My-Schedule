import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  givePrivelegesURL: string = 'http://localhost:3000/UA/givePriveleges';
  constructor(private http:HttpClient) { }
  givePriveleges(email:string):Observable<any>{
    console.log(localStorage.getItem('currentToken'))
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append("Authorization", "Bearer " + localStorage.getItem('currentToken'));
    const httpOptions = {
      headers: headers
    };
    const body= {
      email:email
    };
    return this.http.put(`${this.givePrivelegesURL}`,body, httpOptions)
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
