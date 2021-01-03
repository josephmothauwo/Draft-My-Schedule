import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  givePrivelegesURL: string = 'http://localhost:3000/UA/givePriveleges';
  hideReviewURL: string = 'http://localhost:3000/UA/hideReview';
  showReviewURL: string = 'http://localhost:3000/UA/showReview';
  deactivateURL: string = 'http://localhost:3000/UA/deactivate';
  reactivateURL: string = 'http://localhost:3000/UA/reactivate';
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

  hideReview(id:string):Observable<any>{
    console.log(localStorage.getItem('currentToken'))
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append("Authorization", "Bearer " + localStorage.getItem('currentToken'));
    const httpOptions = {
      headers: headers
    };
    const body= {
      id:id
    };
    return this.http.put(`${this.hideReviewURL}`,body, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  showReview(id:string):Observable<any>{
    console.log(localStorage.getItem('currentToken'))
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append("Authorization", "Bearer " + localStorage.getItem('currentToken'));
    const httpOptions = {
      headers: headers
    };
    const body= {
      id:id
    };
    return this.http.put(`${this.showReviewURL}`,body, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  deactivateUser(email:string):Observable<any>{
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
    return this.http.put(`${this.deactivateURL}`,body, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  reactivateUser(email:string):Observable<any>{
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
    return this.http.put(`${this.reactivateURL}`,body, httpOptions)
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
