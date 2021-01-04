import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  // all urls for getting to the backend
  givePrivelegesURL: string = 'http://localhost:3000/UA/givePriveleges';
  hideReviewURL: string = 'http://localhost:3000/UA/hideReview';
  showReviewURL: string = 'http://localhost:3000/UA/showReview';
  deactivateURL: string = 'http://localhost:3000/UA/deactivate';
  reactivateURL: string = 'http://localhost:3000/UA/reactivate';
  policyURL: string = 'http://localhost:3000/UA/policy';
  constructor(private http:HttpClient) { }
  // give all priveleges to the any user
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
//  hide a review in question for DMCA
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
// show a review that should be shown again
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
// deactivate a user who has been violated the AUP
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
// reactivate a user who was wrongly deactivated
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
  // update any of the policies
  updatePolicy(policy:string, policyName: string):Observable<any>{
    console.log(localStorage.getItem('currentToken'))
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    headers = headers.append("Authorization", "Bearer " + localStorage.getItem('currentToken'));
    const httpOptions = {
      headers: headers
    };
    const body= {
      policy:policy,
      policyName: policyName
    };
    return this.http.put(`${this.policyURL}`,body, httpOptions)
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
